const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist_song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add song in the playlist');
    }
  }

  async getSongsOnPlaylist(playlistId) {
    const query = {
      text: `
          SELECT s.id, s.title, s.performer
          FROM playlist_songs ps
          JOIN playlists p ON p.id = ps.playlist_id
          JOIN songs s ON s.id = ps.song_id
          WHERE ps.playlist_id = $1
        `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: `
        DELETE FROM playlist_songs
        WHERE playlist_id = $1
        AND song_id = $2
        RETURNING id
      `,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to delete song in the playlist');
    }
  }
}

module.exports = PlaylistSongsService;
