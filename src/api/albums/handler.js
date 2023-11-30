const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(
    albumsService,
    songsService,
    storageService,
    albumValidator,
    uploadValidator,
  ) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._storageService = storageService;
    this._albumValidator = albumValidator;
    this._uploadValidator = uploadValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._albumValidator.validateAlbumPayload(request.payload);

    const albumId = await this._albumsService.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album successfully to add',
      data: {
        albumId,
      },
    });
    response.code(201);

    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;

    const album = await this._albumsService.getAlbumById(id);
    const songs = await this._songsService.getSongsByAlbumId(id);

    album.songs = songs;

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumHandler(request) {
    this._albumValidator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._albumsService.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album successfully to update',
    };
  }

  async deleteAlbumHandler(request) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album successfully to delete',
    };
  }

  async postAlbumCoverHandler(request, h) {
    const { id: albumId } = request.params;
    this._albumsService.verifyAlbum(albumId);

    const { cover } = request.payload;
    this._uploadValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;
    this._albumsService.upsertAlbumCover(albumId, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);

    return response;
  }
}

module.exports = AlbumsHandler;
