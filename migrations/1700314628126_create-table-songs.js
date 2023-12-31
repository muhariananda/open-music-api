exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(64)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(225)',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(225)',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(225)',
      notNull: true,
    },
    duration: {
      type: 'INT',
      allowNull: true,
    },
    album_id: {
      type: 'VARCHAR(225)',
      allowNull: true,
    },
  });
  pgm.addConstraint('songs', 'fk_albumId', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
