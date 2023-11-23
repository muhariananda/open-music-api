const autoBind = require('auto-bind');

const Actions = {
  add: 'add',
  delete: 'delete',
};

class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, songsService, activitiesService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._activitiesService = activitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(
      name,
      credentialId,
    );

    const response = h.response({
      status: 'success',
      message: 'Playlist successfully to add',
      data: {
        playlistId,
      },
    });
    response.code(201);

    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist successfully to delete',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._songsService.verifySong(songId);
    await this._playlistsService.verifyPlaylistCollaboration(playlistId, userId);
    await this._playlistSongsService.addSongToPlaylist(playlistId, songId);
    await this._activitiesService.addActivity(playlistId, songId, userId, Actions.add);

    const response = h.response({
      status: 'success',
      message: 'Song successfully add to playlist',
    });
    response.code(201);

    return response;
  }

  async getSongsOnPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistCollaboration(playlistId, userId);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistSongsService.getSongsOnPlaylist(playlistId);

    playlist.songs = songs;

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistCollaboration(playlistId, userId);
    await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);
    await this._activitiesService.addActivity(playlistId, songId, userId, Actions.delete);

    return {
      status: 'success',
      message: 'Song successfully to delete from playlist',
    };
  }

  async getActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistCollaboration(playlistId, userId);
    const activities = await this._activitiesService.getActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
