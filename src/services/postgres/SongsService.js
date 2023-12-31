const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { buildGetSongQuery } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifySong(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
  }

  async addSong(song) {
    const {
      title, year, genre, performer, duration, albumId,
    } = song;

    const id = `song-${nanoid(16)}`;

    const query = {
      text: `
        INSERT INTO songs
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);
    const songId = result.rows[0].id;

    if (!songId) {
      throw new InvariantError('Failed to add song');
    }

    return songId;
  }

  async getSongs(title, performer) {
    const query = buildGetSongQuery(title, performer);
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }

    return result.rows[0];
  }

  async getSongsByAlbumId(id) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async editSongById(id, song) {
    const {
      title, year, genre, performer, duration, albumId,
    } = song;

    const query = {
      text: `
        UPDATE songs 
        SET 
          title = $1,
          year = $2,
          genre = $3,
          performer = $4,
          duration = $5,
          album_id = $6
        WHERE id = $7 RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update song. Id not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete song. Id not found');
    }
  }
}

module.exports = SongsService;
