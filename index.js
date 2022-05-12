require('dotenv').config()
const http = require('http');
const App = require('./src/app');
const Logger = require('./src/utils/pino');

const port = process.env.PORT || 1111;

const Server = {
    async start() {
        const server = http.createServer(App);
        return server.listen(port);
    },
};

Server.start()
    .then(() => Logger.info(`Server is up and Running on port ${port}`))
    .catch((err) => Logger.error(err));

module.exports = Server;