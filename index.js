const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');

let users = [
    {
        id: 1,
        name: "Sam",
        favoriteMovies: [
            "Oldboy",
            "Taxi Driver"
        ]
    },
    {
        id: 2,
        name: "Peter",
        favoriteMovies: [
            "Big Fish",
            "The Last Samurai",
            "Full Metal Jacket"
        ]
    }
]

let topMovies = [
    {
        id: 1,
        title: "Oldboy",
        description: "...",
        genres: [
            {
                id: 1,
                name: "thriller",
                description: "..."
            }
        ],
        director: {
            id: 1,
            name: "Park Chan-wook",
            bio: "...",
            yearBirth: 1963,
            yearDeath: null
        },
        imageURL: "..."
    },
    {
        id: 2,
        title: 'Taxi Driver',
        description: "...",
        genres: [
            {
                id: 1,
                name: "thriller",
                description: "..."
            }
        ],
        director: {
            id: 2,
            name: "Martin Scorsese",
            bio: "...",
            yearBirth: 1942,
            yearDeath: null
        },
        imageURL: "..."
    },
    {
        id: 3,
        title: "Léon: The Professional",
        description: "...",
        genres: [
            {
                id: 2,
                name: "action-thriller",
                description: "..."
            }
        ],
        director: {
            id: 3,
            name: "Luc Besson",
            bio: "...",
            yearBirth: 1959,
            yearDeath: null
        },
        imageURL: "..."
    },
    {
        id: 4,
        title: "Big Fish",
        description: "...",
        genres: [
            {
                id: 3,
                name: "comedy-drama",
                description: "..."
            }
        ],
        director: {
            id: 4,
            name: "Tim Burton",
            bio: "...",
            yearBirth: 1958,
            yearDeath: null
        },
        imageURL: "..."
    },
    {
        id: 5,
        title: "The Last Samurai",
        description: "...",
        genres: [
            {
                id: 4,
                name: "historical drama",
                description: "..."
            }
        ],
        director: {
            id: 5,
            name: "Edward Zwick",
            bio: "...",
            yearBirth: 1952,
            yearDeath: null
        },
        imageURL: "..."
    },
    {
        id: 6,
        title: "Schindler\'s List",
        description: "...",
        genres: [
            {
                id: 4,
                name: "historical drama",
                description: "..."
            }
        ],
        director: {
            id: 6,
            name: "Steven Spielberg",
            bio: "...",
            yearBirth: 1946,
            yearDeath: null
        },
        imageURL: "..."
    },
    {
        id: 7,
        title: "Full Metal Jacket",
        description: "...",
        genres: [
            {
                id: 5,
                name: "war",
                description: "..."
            },
            {
                id: 1,
                name: "thriller",
                description: "..."
            }
        ],
        director: {
            id: 7,
            name: "Stanley Kubrick",
            bio: "...",
            yearBirth: 1928,
            yearDeath: 1999
        },
        imageURL: "..."
    },
    {
        id: 8,
        title: "The New World",
        description: "...",
        genres: [
            {
                id: 6,
                name: "drama",
                description: "..."
            }
        ],
        director: {
            id: 8,
            name: "Terrence Malick",
            bio: "...",
            yearBirth: 1943,
            yearDeath: null
        },
        imageURL: "..."
    },
    {
        id: 9,
        title: "Grand Budapest Hotel",
        description: "...",
        genres: [
            {
                id: 3,
                name: "comedy-drama",
                description: "..."
            }
        ],
        director: {
            id: 9,
            name: "Wes Anderson",
            bio: "...",
            yearBirth: 1969,
            yearDeath: null
        },
        imageURL: "..."
    },
    {
        id: 10,
        title: "This Is England",
        description: "...",
        genres: [
            {
                id: 6,
                name: "drama",
                description: "..."
            }
        ],
        director: {
            id: 10,
            name: "Shane Meadows",
            bio: "...",
            yearBirth: 1972,
            yearDeath: null
        },
        imageURL: "..."
    }
];

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('common'));

// Create
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send("No user-name!");
    }
});

// Create
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${user.name}'s favourite movies.`)
    } else {
        res.status(400).send("User not found!");
    }
});

// Delete
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from ${user.name}'s favourite movies.`)
    } else {
        res.status(400).send("User not found!");
    }
});

// Delete
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`User ${user.name} has been deleted.`)
    } else {
        res.status(400).send("User not found!");
    }
});

// Update
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send("User not found!");
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Movie-API!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
    res.status(200).json(topMovies);
});

app.get('/movies/:title', (req, res) => {
    // Object destructuring
    const { title } = req.params;
    const movie = topMovies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send("Movie not found!");
    }
});

app.get('/movies/genres/:genreName', (req, res) => {
    // Object destructuring
    const { genreName } = req.params;
    const genres = topMovies.find(movie => movie.genres.find(genres => genres.name === genreName)).genres;
    const genre = genres.find(genre => genre.name === genreName);

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send("Genre not found!");
    }
});

app.get('/movies/directors/:directorName', (req, res) => {
    // Object destructuring
    const { directorName } = req.params;
    const director = topMovies.find(movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send("Director not found!");
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});