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

let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://movie-api-zy6n.onrender.com',
    'https://myflixone.netlify.app'];



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
    check('Username', 'Username is required').isLength({ min: 3 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send('User ' + req.body.Username + ' already exists');
            } else {
                Users.create(
                    {
                        username: req.body.Username,
                        password: hashedPassword,
                        email: req.body.Email,
                        birthday: req.body.Birthday,
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
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne(
        { username: req.params.Username }
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
app.post('/users/:Username/movies/:Movietitle', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(
        { title: req.params.Movietitle }
    )
        .then((movie) => {
            Users.findOneAndUpdate(
                { username: req.params.Username },
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
app.delete('/users/:Username/movies/:Movietitle', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(
        { title: req.params.Movietitle }
    )
        .then((movie) => {
            Users.findOneAndUpdate(
                { username: req.params.Username },
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Update a user's info, by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), [
    check('Username', 'Username is required').isLength({ min: 3 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }


    Users.findOne({ username: req.params.Username })
        .then(function (user) {
            let newPassword = "";
            // check if newPassword is hashedPassword (hashedPassword was passed)
            if (user.password === req.body.Password) {
                newPassword = req.body.Password;
            } else {
                newPassword = Users.hashPassword(req.body.Password);
            }

            Users.updateOne(
                { username: req.params.Username },
                {
                    $set: {
                        username: req.body.Username,
                        password: newPassword,
                        email: req.body.Email,
                        birthday: req.body.Birthday,
                        favoriteMovies: req.body.FavoriteMovies,
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

// Get a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(
        { title: req.params.Title }
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
app.get('/movies/genres/:GenreName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne(
        { "genres.name": req.params.GenreName }
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

