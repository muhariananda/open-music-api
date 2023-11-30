exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
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
  });

  pgm.addConstraint('playlist_songs', 'fk_playlist_id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('playlist_songs', 'fk_song_id', {
    foreignKeys: {
      columns: 'song_id',
      references: 'songs(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
