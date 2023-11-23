const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(
    collaborationsService,
    playlistsService,
    usersService,
    validator,
  ) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: owner } = request.auth.credentials;

    await this._usersService.verifyUser(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);

    const collaborationId = await this._collaborationsService.addCollaboration(
      playlistId,
      userId,
    );

    const response = h.response({
      status: 'success',
      message: 'Collaborations has been created',
      data: {
        collaborationId,
      },
    });
    response.code(201);

    return response;
  }

  async deleteCollaborationsHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: owner } = request.auth.credentials;

    await this._usersService.verifyUser(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Collaboration has been deleted',
    };
  }
}

module.exports = CollaborationsHandler;
