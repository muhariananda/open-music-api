exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(64)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(225)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(64)',
      allowNull: true,
    },
  });

  pgm.addConstraint('playlists', 'fk_owner', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
