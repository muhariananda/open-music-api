const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const id = `collaboration-${nanoid(16)}`;

    const query = {
      text: `
        INSERT INTO collaborations 
        VALUES($1, $2, $3) 
        RETURNING id
      `,
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    const collaborationId = result.rows[0].id;

    if (!collaborationId) {
      throw new InvariantError('Failed to add collaboration');
    }

    return collaborationId;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: `
        DELETE FROM collaborations 
        WHERE playlist_id = $1 
        AND user_id = $2 
        RETURNING id
      `,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to delete collaborations');
    }
  }
}

module.exports = CollaborationsService;
