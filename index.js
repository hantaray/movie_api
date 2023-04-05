const express = require('express'),
    morgan = require('morgan');

const app = express();

let topMovies = [
    {
        title: 'Taxi Driver',
        director: 'Martin Scorsese'
    },
    {
        title: 'Oldboy',
        director: 'Park Chan-wook'
    },
    {
        title: 'Léon: The Professional',
        director: 'Luc Besson'
    },
    {
        title: 'Big Fish',
        director: 'Tim Burton'
    },
    {
        title: 'The Last Samurai',
        director: 'Edward Zwick'
    },
    {
        title: 'Schindler\'s List',
        director: 'Steven Spielberg'
    },
    {
        title: 'Full Metal Jacket',
        director: 'Stanley Kubrick'
    },
    {
        title: 'The New World',
        director: 'Terrence Malick'
    },
    {
        title: 'Grand Budapest Hotel',
        director: 'Wes Anderson'
    },
    {
        title: 'This Is England',
        director: 'Shane Meadows'
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