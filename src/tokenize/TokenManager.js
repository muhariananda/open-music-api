const Jwt = require('@hapi/jwt');
const { config } = require('../utils/config');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, config.jwt.access_token.key),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, config.jwt.refresh_token.key),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.jwt.refresh_token.key);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (err) {
      throw new InvariantError('Invalid Refresh Token');
    }
  },
};

module.exports = TokenManager;
