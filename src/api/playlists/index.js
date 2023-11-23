const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, {
    playlistsService, playlistSongsService, songsService, activitiesService, validator,
  }) => {
    const playlistHandler = new PlaylistsHandler(
      playlistsService,
      playlistSongsService,
      songsService,
      activitiesService,
      validator,
    );
    server.route(routes(playlistHandler));
  },
};
