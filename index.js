const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    cors = require('cors'),
    { check, validationResult } = require('express-validator'),
    Movies = Models.Movie,
    Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true, family: 4 });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true, family: 4 });

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));

let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'http://localhost:4200',
    'https://movie-api-zy6n.onrender.com', 'https://myflixone.netlify.app', 'https://hantaray.github.io'];



app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Add a user (create)
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', [
    check('username', 'Username is required').isLength({ min: 3 }),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
    Users.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                return res.status(400).send('User ' + req.body.username + ' already exists');
            } else {
                Users.create(
                    {
                        username: req.body.username,
                        password: hashedPassword,
                        email: req.body.email,
                        birthday: req.body.birthday,
                        favoriteMovies: []
                    }
                )
                    .then((user) => { res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne(
        { username: req.params.username }
    )
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Add a movie to a user's list of favorites
app.post('/users/:username/movies/:movietitle', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(
        { title: req.params.movietitle }
    )
        .then((movie) => {
            Users.findOneAndUpdate(
                { username: req.params.username },
                { $push: { favoriteMovies: movie._id } },
                // return the updated object
                { new: true }
            )
                .then((user) => {
                    res.json(user);
                })
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Remove a movie to a user's list of favorites
app.delete('/users/:username/movies/:movietitle', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(
        { title: req.params.movietitle }
    )
        .then((movie) => {
            Users.findOneAndUpdate(
                { username: req.params.username },
                { $pull: { "favoriteMovies": movie._id } },
                // return the updated object
                { new: true }
            )
                .then((user) => {
                    res.json(user);
                })
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Delete a user by username
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found');
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Update a user's info, by username
app.put('/users/:username', passport.authenticate('jwt', { session: false }), [
    check('username', 'Username is required').isLength({ min: 3 }),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }


    Users.findOne({ username: req.params.username })
        .then(function (user) {
            let newPassword = "";
            // check if newPassword is hashedPassword (hashedPassword was passed)
            if (user.password === req.body.password) {
                newPassword = req.body.password;
            } else {
                newPassword = Users.hashPassword(req.body.password);
            }

            Users.updateOne(
                { username: req.params.username },
                {
                    $set: {
                        username: req.body.username,
                        password: newPassword,
                        email: req.body.email,
                        birthday: req.body.birthday,
                        favoriteMovies: req.body.favoriteMovies,
                    }
                },
                // return the updated object
                { new: true }
            )
                .then((user) => {
                    res.json(user);
                })
                .catch((error) => {
                    res.status(500).send('Error: ' + error);
                });
        });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Movie-API!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a movie by movieId
app.get('/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(
        { _id: req.params.movieId }
    )
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// Get data about a genre by genreName
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(
        { "genres.name": req.params.genreName }
    )
        .then((movie) => {
            res.json(movie.genres);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(
        { "director.name": req.params.directorName }
    )
        .then((movie) => {
            res.json(movie.director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});

