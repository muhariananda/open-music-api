const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: `
            INSERT INTO playlist_song_activities
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id
        `,
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to Activity');
    }
  }

  async getActivities(playlistId) {
    const query = {
      text: `
            SELECT u.username, s.title, psa.action, psa.time
            FROM playlist_song_activities psa
            JOIN songs s ON s.id = psa.song_id
            JOIN users u ON u.id = psa.user_id
            WHERE psa.playlist_id = $1
            ORDER BY psa.time
        `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ActivitiesService;
