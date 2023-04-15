const express = require('express'),
    morgan = require('morgan');

const app = express();

let topMovies = [
    {
        id: 1,
        title: "Oldboy",
        description: "...",
        genre: "thriller",
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
        genre: "thriller",
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
        genre: "action-thriller",
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
        genre: "comedy-drama",
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
        genre: "historical drama",
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
        genre: "historical drama",
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
        genre: "war",
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
        genre: "drama",
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
        genre: "comedy-drama",
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
        genre: "drama",
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
app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to the Movie-API!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});