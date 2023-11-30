const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async hasUserLikeAlbum(userId, albumId) {
    const query = {
      text: `
        SELECT id FROM user_album_likes
        WHERE user_id = $1 AND album_id = $2
      `,
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('Failed to like album. User was like this album');
    }
  }

  async addLike(userId, albumId) {
    await this.hasUserLikeAlbum(userId, albumId);
    const id = `like-${nanoid(16)}`;

    const query = {
      text: `
            INSERT INTO user_album_likes
            VALUES($1, $2, $3)
            RETURNING id
        `,
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to like album');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: `
        DELETE FROM user_album_likes
        WHERE user_id = $1 AND album_id = $2
        RETURNING id
      `,
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to remove like from album');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getLikesCount(albumId) {
    try {
      const count = await this._cacheService.get(`likes:${albumId}`);
      return {
        count,
        isCache: true,
      };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const count = result.rowCount;

      await this._cacheService.set(`likes:${albumId}`, count);

      return { count };
    }
  }
}

module.exports = AlbumLikesService;
