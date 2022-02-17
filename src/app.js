const express = require('express');
const cors = require('cors');
const compression = require('compression');
const logger = require('morgan');
const pino = require('./utils/pino');


// express app 
const app = express();

//middlewares
app.use(cors());
app.use(compression());
app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({  extended:  false }))

// global variables
global.logger = pino;

// main page
app.use('/', (req, res) => {
    res.send('Welcome to Belves');
});

module.exports = app;