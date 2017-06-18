const express = require('express');
const calendar = require('./calendar/calendar');
const route = require('./route/route');

const app = express();


if (process.argv[2] === 'host') {
    console.log('hosting html');
    app.use(express.static(__dirname + '/../html'));
} else {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
}

app.get('/calendar/', calendar);

app.get('/route/', route);

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});
