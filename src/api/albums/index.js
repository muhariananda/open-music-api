const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (
    server,
    {
      albumsService,
      albumLikesService,
      songsService,
      storageService,
      albumValidator,
      uploadValidator,
    },
  ) => {
    const albumsHandler = new AlbumsHandler(
      albumsService,
      albumLikesService,
      songsService,
      storageService,
      albumValidator,
      uploadValidator,
    );
    server.route(routes(albumsHandler));
  },
};
