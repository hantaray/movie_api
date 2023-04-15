const express = require('express'),
    morgan = require('morgan');

const app = express();

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
            "Full Metal JAcket"
        ]
    }
]

let topMovies = [
    {
        id: 1,
        title: "Oldboy",
        description: "...",
        genre: [
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
        genre: [
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
        genre: [
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
        genre: [
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
        genre: [
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
        genre: [
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
        genre: [
            {
                id: 5,
                name: "war",
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
        genre: [
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
        genre: [
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
        genre: [
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
app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to the Movie-API!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies/:title', (req, res) => {
    res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});