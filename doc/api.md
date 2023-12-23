# Open Music API Documentation

Welcome to the documentation for the Open Music API. This document provides information on the endpoints, request/response formats, and authentication methods for interacting with the API.

## Table of Contents

1. [Authentication](#authentication)
2. [Endpoints](#endpoints)
    - [1. Album Management](#1-album-management)
    - [2. Song Management](#2-song-management)
    - [3. Playlist Management](#3-playlist-management)
    - [4. Playlist Collaboration](#4-playlist-collaboration)
3. [Response Status Codes](#response-status-codes)
4. [Error Handling](#error-handling)
5. [Conclusion](#conclusion)

## Authentication

To access protected endpoints, you need to include a valid JWT (JSON Web Token) in the Authorization header of your HTTP requests.

### Authentication Endpoint

Register User

- **URL:** `/users`
- **Method:** `POST`
- **Request:**

  ``` json
  {
    "username": "your_username",
    "password": "your_password",
    "fullname": "your_fullname"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "User added successfully",
        "data": {
            "userId": "user-id",
        }
    }
    ```

Login

- **URL:** `/authentications`
- **Method:** `POST`
- **Request:**

  ``` json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Authentication successfully add",
        "data": {
            "accessToken": "your_access_token",
            "refreshToken": "your_refresh_token",
        }
    }
    ```

Update Access token

- **URL:** `/authentications`
- **Method:** `PUT`
- **Request:**

  ``` json
  {
    "refreshToken": "your_refresh_token"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Access token successfully update",
        "data": {
            "accessToken": "your_access_token",
        }
    }
    ```

Logout

- **URL:** `/authentications`
- **Method:** `DELETE`
- **Request:**

  ``` json
  {
    "refreshToken": "your_refresh_token"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Refresh token successfully delete"
    }
    ```

Use the received access token in the **Authorization header** of subsequent requests:

```bash
    Authorization: Bearer <your_access_token>
```

## Endpoints

### 1. **Album Management**

Post Album

- **URL:** `/albums`
- **Method:** `POST`
- **Request:**

  ``` json
  {
    "name": "album_name",
    "year": 2023
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Album successfully to add",
        "data": {
            "albumId": "album-id"
        }
    }
    ```

Get Album by Id

- **URL:** `/albums/{id}`
- **Method:** `GET`
- **Response**

    ```json
    {
        "status": "success",
        "data": {
            "album": {
                "id": "album-id",
                "name": "album_name",
                "year": 2023,
                "coverUrl": "cover_url",
                "songs": [
                    {
                        "id": "song-id",
                        "title": "song_title",
                        "performer": "performer_name"
                    }
                ]
            }
        }
    }
    ```

Put Album

- **URL:** `/albums/{id}`
- **Method:** `PUT`
- **Request:**

  ``` json
  {
    "name": "album_name",
    "year": 2023
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Album successfully to update"
    }
    ```

Delete Album

- **URL:** `/albums/{id}`
- **Method:** `DELETE`
- **Response**

    ```json
    {
        "status": "success",
        "message": "Album successfully to delete"
    }
    ```

Add Like Album

- **URL:** `/albums/{id}/likes`
- **Method:** `POST`
- **Response**

    ```json
    {
        "status": "success",
        "message": "Success to like album"
    }
    ```

Get Like Count Album

- **URL:** `/albums/{id}/likes`
- **Method:** `GET`
- **Response**

    ```json
    {
        "status": "success",
        "data": {
            "likes": 10
        }
    }
    ```

Remove Like from Album

- **URL:** `/albums/{id}/likes`
- **Method:** `DELETE`
- **Response**

    ```json
    {
        "status": "success",
        "message": "Success to delete like from album"
    }
    ```

### 2. **Song Management**

Post Song

- **URL:** `/songs`
- **Method:** `POST`
- **Request:**

  ``` json
  {
    "title": "song_title",
    "year": 2023,
    "genre": "song_genre",
    "performer": "song_performer",
    "duration": 0,
    "albumId": "album-id"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Album successfully to add",
        "data": {
            "songId": "song-id"
        }
    }
    ```

Get Songs

- **URL:** `/songs?title=title&performer=performer`
- **Method:** `GET`
- **Response**

    ```json
    {
        "status": "success",
        "data": {
            "songs": [
                {
                    "id": "song-id",
                    "title": "song_title",
                    "performer": "song_performer"
                }
            ]
        }
    }
    ```

Put Song

- **URL:** `/songs/{id}/`
- **Method:** `PUT`
- **Request:**

  ``` json
  {
    "title": "song_title",
    "year": 2023,
    "genre": "song_genre",
    "performer": "song_performer",
    "duration": 0,
    "albumId": "album-id"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Song successfully to update"
    }
    ```

Delete Song

- **URL:** `/songs/{id}/`
- **Method:** `DELETE`

- **Response**

    ```json
    {
        "status": "success",
        "message": "Song successfully to delete"
    }
    ```

### 3. **Playlist Management**

Post Playlist

- **URL:** `/playlists`
- **Method:** `POST`
- **Request:**

  ``` json
  {
    "name": "playlist_name"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Playlist successfully to add",
        "data": {
            "playlistId": "playlist-id"
        }
    }
    ```

Get Playlist

- **URL:** `/playlists`
- **Method:** `GET`
- **Response**

    ```json
    {
        "status": "success",
        "data": {
            "playlists": [
                {
                    "id": "playlist-id",
                    "name": "playlist_name",
                    "username": "username"
                }
            ]
        }
    }
    ```

Delete Playlist

- **URL:** `/playlists/{id}`
- **Method:** `DELETE`
- **Response**

    ```json
    {
        "status": "success",
        "message": "Playlist successfully to delete",
    }
    ```

Post Song to Playlist

- **URL:** `/playlists/{id}/songs`
- **Method:** `POST`
- **Request:**

  ``` json
  {
    "songId": "song-id"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Song successfully add to playlist"
    }
    ```

Get Songs in Playlist

- **URL:** `/playlists/{id}/songs`
- **Method:** `GET`
- **Response**

    ```json
    {
        "status": "success",
        "data": {
            "playlist" : {
                "id": "playlist-id",
                "name": "playlist_name",
                "username": "username",
                "songs": [
                    {
                        "id": "song-id",
                        "title": "song_title",
                        "performer": "performer_name"
                    }
                ]
            }
        }
    }
    ```

Delete Song From Playlist

- **URL:** `/playlists/{id}/songs`
- **Method:** `DELETE`
- **Request:**

  ``` json
  {
    "songId": "song-id"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Song successfully to delete from playlist"
    }
    ```

### 4. **Playlist Collaboration**

Post Collaboration

- **URL:** `/collaborations`
- **Method:** `POST`
- **Request:**

  ``` json
  {
    "playlistId": "playlist-id",
    "userId": "user-id"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Collaborations has been created",
        "data" : {
            "collaborationId": "collaboration-id"
        }
    }
    ```

Delete Collaboration

- **URL:** `/collaborations`
- **Method:** `DELETE`
- **Request:**

  ``` json
  {
    "playlistId": "playlist-id",
    "userId": "user-id"
  }
  ```

- **Response**

    ```json
    {
        "status": "success",
        "message": "Collaboration has been deleted"
    }
    ```

Get Playlist Collaboration Activities

- **URL:** `/playlist/{id}/activities`
- **Method:** `GET`
- **Response**

    ```json
    {
        "status": "success",
        "data": {
            "playlistId": "playlist-id",
            "activities": [
                {
                    "username": "username",
                    "title": "song-title",
                    "action": "add",
                    "time": "time"
                },
                {
                    "username": "username",
                    "title": "song-title",
                    "action": "delete",
                    "time": "time"
                },
            ]
        }
    }
    ```

## Response Status Codes

- `200 OK`: Successful operation.
- `201 Created`: Resource created successfully.
- `400 Bad Request`: Malformed request or invalid parameters.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Do not have permission to access resource.
- `404 Not Found`: Resource not found.
- `500 Internal Server Error`: Unexpected server error.

## Error Handling

```json
{
    "status": "fail",
    "message": "Additional message about the error"
}
```

## Conclusion

This concludes the documentation for the Open Music API. If you have any questions or need further assistance, feel free to reach out.

Happy coding!
