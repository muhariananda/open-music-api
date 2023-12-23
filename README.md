# Open Music API

Open Music API is a powerful and flexible RESTful API designed for managing music-related features such as album and playlist management, song management, user authentication, and collaboration playlists with other registered users. It is built using JavaScript and Node.js, utilizing the hapi framework for seamless development. The API also integrates with PostgreSQL for the relational database, JWT for user authentication, RabbitMQ as a message broker, and Redis for caching.

## Features

- Album Management
- Song Management
- Playlist Management
- User Authentication with JWT
- Playlist Collaboration with Registered Users
- Seamless Integration with PostgreSQL
- Efficient Message Broker using RabbitMQ
- Redis Caching for Improved Performance

## Technologies Used

- JavaScript
- [Node.js](https://nodejs.org/en)
- [Hapi Framework](https://hapi.dev/)
- [PostgreSQL](https://www.postgresql.org/) (Relational Database)
- [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token) (JSON Web Tokens) for User Authentication
- [RabbitMQ](https://rabbitmq.com/) (Message Broker)
- [Redis](https://redis.io/) (Caching)

## Getting Started

To get started with Open Music API, follow these steps:

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/muhariananda/open-music-api.git
    cd open-music-api
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Database Setup:**
    - Set up a PostgreSQL database and update the connection details in the configuration files.

4. **Environment Configuration:**
    - Create a `.env` file based on the provided `.env.example` and fill in the necessary details.

5. **Run Migration**

    ```bash
    npm run migrate up
    ```

6. **Run the Application:**

    ```bash
    npm start
    ```

7. **API Documentation:**
    - Visit [API Documentation](docs/api.md) for detailed information on endpoints and usage.

## API Documentation

For detailed information on how to use the API, refer to the [API Documentation](docs/api.md).

---

Happy coding! ❤️🖥️
