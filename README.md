# Movie-API

A movie database API built using Express, MongoDB, and Mongoose.

## Setup and Installation

1. **Install dependencies:**
    ```bash
    npm install express morgan body-parser uuid mongoose cors express-validator passport
    ```

2. **Set up MongoDB connection:**
    - Set your MongoDB connection string as an environment variable:
        ```bash
        export CONNECTION_URI=your_mongo_connection_string
        ```

3. **Run the server:**
    ```bash
    node yourFileName.js
    ```

## Endpoints

### Welcome

- `GET /` - Welcome to HOT POTATOES.

### Movies

- `GET /movies` - Retrieve all movies.
- `GET /movies/:Title` - Get a specific movie by title. *(JWT authentication required)*
- `GET /movies/genre/:Name` - Get movies by genre. *(JWT authentication required)*
- `GET /movies/director/:Name` - Get movies by director. *(JWT authentication required)*

### Users

- `POST /users` - Register a new user. 
    - Fields: `Username`, `Password`, `Email` (Birthday is optional)
- `PUT /users/:Username` - Update user information. *(JWT authentication required)*
- `DELETE /users/:Username` - Delete a user. *(JWT authentication required)*

### Favorite Movies

- `POST /users/:Username/movies/:MovieID` - Add a movie to favorites. *(JWT authentication required)*
- `DELETE /users/:Username/movies/:MovieID` - Remove a movie from favorites. *(JWT authentication required)*

## Notes

Remember to secure sensitive data like your MongoDB connection string using environment variables or other secure methods.
