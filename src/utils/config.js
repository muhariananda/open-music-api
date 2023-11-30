const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  jwt: {
    access_token: {
      key: process.env.ACCESS_TOKEN_KEY,
      age: process.env.ACCESS_TOKEN_AGE,
    },
    refresh_token: {
      key: process.env.REFRESH_TOKEN_KEY,
    },
  },
  rabbitmq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    server: process.env.REDIS_SERVER,
  },
};

module.exports = { config };
