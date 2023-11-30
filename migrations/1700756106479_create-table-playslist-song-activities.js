exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(64)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(64)',
      allowNull: true,
    },
    song_id: {
      type: 'VARCHAR(64)',
      allowNull: true,
    },
    user_id: {
      type: 'VARCHAR(64)',
      allowNull: true,
    },
    action: {
      type: 'VARCHAR(32)',
      notNull: true,
    },
    time: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('playlist_song_activities', 'fk_playlist_id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('playlist_song_activities', 'fk_song_id', {
    foreignKeys: {
      columns: 'song_id',
      references: 'songs(id)',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('playlist_song_activities', 'fk_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
