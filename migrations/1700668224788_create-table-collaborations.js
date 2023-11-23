/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(64)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(64)',
      allowNull: true,
    },
    user_id: {
      type: 'VARCHAR(64)',
      allowNull: true,
    },
  });

  pgm.addConstraint('collaborations', 'fk_playlist_id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('collaborations', 'fk_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
