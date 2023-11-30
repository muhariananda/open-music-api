const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(
    albumsService,
    albumLikesService,
    storageService,
    albumValidator,
    uploadValidator,
  ) {
    this._albumsService = albumsService;
    this._albumLikesService = albumLikesService;
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

  async postAlbumCoverHandler(request, h) {
    const { id: albumId } = request.params;
    await this._albumsService.verifyAlbum(albumId);

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

  async postAlbumLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumsService.verifyAlbum(albumId);
    await this._albumLikesService.addLike(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Success to like album',
    });
    response.code(201);

    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;

    const album = await this._albumsService.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async getAlbumLikesCountHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumsService.verifyAlbum(albumId);
    const { count, isCache } = await this._albumLikesService.getLikesCount(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(count, 10),
      },
    });
    if (isCache) response.header('X-Data-Source', 'cache');

    return response;
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

  async deleteAlbumLikeHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumsService.verifyAlbum(albumId);
    await this._albumLikesService.deleteLike(userId, albumId);

    return {
      status: 'success',
      message: 'Success to delete like from album',
    };
  }
}

module.exports = AlbumsHandler;
