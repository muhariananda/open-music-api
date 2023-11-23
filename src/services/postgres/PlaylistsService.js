const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(name, owner) {
    const id = `playlists-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    const playlistId = result.rows[0].id;

    if (!playlistId) {
      throw new InvariantError('Failed to add playlist');
    }

    return playlistId;
  }

  async getPlaylists(owner) {
    const query = {
      text: `
        SELECT p.id, p.name, u.username 
        FROM playlists p 
        JOIN users u ON p.owner = u.id
        LEFT JOIN collaborations c ON p.id = c.playlist_id
        WHERE p.owner = $1 OR c.user_id = $1
      `,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: `
        SELECT p.id, p.name, u.username
        FROM playlists p
        JOIN users u ON p.owner = u.id
        WHERE p.id = $1 
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist is not found');
    }

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete Playlist. Id not found');
    }
  }

  async verifyPlaylist(id) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found');
    }

    return result.rows[0];
  }

  async verifyPlaylistOwner(id, owner) {
    const playlist = await this.verifyPlaylist(id);

    if (playlist.owner !== owner) {
      throw new AuthorizationError(
        'You are not authorized to access this resource',
      );
    }
  }

  async verifyPlaylistCollaboration(id, userId) {
    await this.verifyPlaylist(id);

    const query = {
      text: `
        SELECT p.id FROM playlists p
        FULL JOIN collaborations c ON p.id = c.playlist_id
        WHERE p.id = $1 AND (p.owner = $2 OR c.user_id = $2)
      `,
      values: [id, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError(
        'You are not authorized to access this resource',
      );
    }
  }
}

module.exports = PlaylistsService;
