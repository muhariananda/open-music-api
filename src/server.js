require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

const plugins = require('./plugins');
const { config } = require('./utils/config');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);

        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      console.error(response);

      const newResponse = h.response({
        status: 'error',
        message: 'Unexpected internal server error',
      });
      newResponse.code(500);

      return newResponse;
    }

    return h.continue;
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: config.jwt.access_token.key,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.access_token.age,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register(plugins);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
