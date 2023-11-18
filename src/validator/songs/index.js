const { SongPayloadSchema } = require('./schema');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw Error(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
