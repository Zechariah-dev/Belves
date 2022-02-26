const express = require('express');
const cors = require('cors');
const compression = require('compression');
const logger = require('morgan');
const pino = require('./utils/pino');
const Database = require('./database');
const routes = require('./routes');
const docs = require('./docs');
const emitter = require('./utils/emitter');



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

// momgodb connection
Database.connect();

// swagger docs
docs(app);

// routes
routes(app);

emitter.on('error', global.logger.error)

// emitter.on('error', global.logger.error);

// TODO
emitter.on('handle_notification_delete', async (request) => {

})

// TODO
emitter.on('handle_notification_delete_all', async(notifications) => {

})

// main page
app.use('/', (req, res) => {
    res.send('Welcome to Belves');
});

module.exports = app;