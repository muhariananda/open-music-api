/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('albums', {
    coverUrl: {
      type: 'VARCHAR(225)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'coverUrl');
};
