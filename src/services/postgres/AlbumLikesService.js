const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor() {
    this._pool = new Pool();
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
  }

  async getLikesCount(albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return result.rowCount;
  }
}

module.exports = AlbumLikesService;
