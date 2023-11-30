exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(64)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(64)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'VARCHAR(64)',
      notNull: true,
    },
    fullname: {
      type: 'VARCHAR(225)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
