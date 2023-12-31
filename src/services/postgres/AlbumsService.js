const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapAlbumDBToAlbum } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsService {
  constructor(songsService) {
    this._pool = new Pool();
    this._songsService = songsService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);
    const albumId = result.rows[0].id;

    if (!albumId) {
      throw new InvariantError('Failed to add album');
    }

    return albumId;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }

    const album = mapAlbumDBToAlbum(result.rows[0]);
    const songs = await this._songsService.getSongsByAlbumId(id);
    album.songs = songs;

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update album. Id not found');
    }
  }

  async upsertAlbumCover(id, fileLocation) {
    const query = {
      text: `
        UPDATE albums
        SET cover_url = $1
        WHERE id = $2
        RETURNING id
      `,
      values: [fileLocation, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add album cover');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete album. Id not found');
    }
  }

  async verifyAlbum(id) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album not found');
    }
  }
}

module.exports = AlbumsService;
