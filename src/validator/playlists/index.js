const {
  PlaylistPayloadSchema,
  PlaylistSongPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const validateResult = PlaylistSongPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
