const path = require('path');

const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumLikesService = require('./services/postgres/AlbumLikesService');
const AlbumValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongValidator = require('./validator/songs');

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationService = require('./services/postgres/AuthenticationService');
const AuthenticationValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/TokenManager');

const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistValidator = require('./validator/playlists');

const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationValidator = require('./validator/collaborations');

const ActivitiesService = require('./services/postgres/ActivitiesService');

const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const StorageService = require('./services/storage/StorageService');
const UploadValidator = require('./validator/uploads');

// init object
const albumsService = new AlbumsService();
const albumLikesService = new AlbumLikesService();
const songsService = new SongsService();

const usersService = new UsersService();
const authenticationsService = new AuthenticationService();

const playlistsService = new PlaylistsService();
const playlistSongsService = new PlaylistSongsService();

const collaborationsService = new CollaborationsService();
const activitiesService = new ActivitiesService();

const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/covers'));

module.exports = [
  {
    plugin: albums,
    options: {
      albumsService,
      albumLikesService,
      songsService,
      storageService,
      albumValidator: AlbumValidator,
      uploadValidator: UploadValidator,
    },
  },
  {
    plugin: songs,
    options: {
      service: songsService,
      validator: SongValidator,
    },
  },
  {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    },
  },
  {
    plugin: authentications,
    options: {
      authenticationsService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationValidator,
    },
  },
  {
    plugin: playlists,
    options: {
      playlistsService,
      playlistSongsService,
      songsService,
      activitiesService,
      validator: PlaylistValidator,
    },
  },
  {
    plugin: collaborations,
    options: {
      collaborationsService,
      playlistsService,
      usersService,
      validator: CollaborationValidator,
    },
  },
  {
    plugin: _exports,
    options: {
      producerService: ProducerService,
      playlistsService,
      validator: ExportsValidator,
    },
  },
];
