const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const pino = require('./utils/pino');
const Database = require('./database');
const routes = require('./routes');
const docs = require('./docs');
const emitter = require('./utils/emitter');
const Logger = require('./utils/pino');

// express app
const app = express();

//middlewares
app.use(cors());
app.use(compression());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// momgodb connection
Database.connect();

// swagger docs
docs(app);

// routes
routes(app);

// event emitter error callback
emitter.on('error', Logger.error);

// main page
app.use('/', (req, res) => {
    res.send('Welcome to Belves');
});

module.exports = app;