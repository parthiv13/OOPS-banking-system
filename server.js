var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    morgan = require('morgan');

var route = require('./routes/routes'),
    apiRouter = require('./routes/apirouters')
    User = require('./models/user'),
    config = require('./config'),
    port = process.env.PORT || 8090;

mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api', apiRouter);
app.use('/setup', route)

app.get('/', (req, res) => {
    res.send('a bit more detailed shit, maybe?');
})

app.listen(port);
console.log('http://localhost:' + port);