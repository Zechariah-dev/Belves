const http = require('http');
const App = require('./src/app');
require('dotenv').config();

const Server = {
    async start() {
      const server = http.createServer(App);
      const port = process.env.PORT || 1111;
      return server.listen(port);
    },
  };
  
Server.start()
    .then(() => global.logger.info('Server is Running'))
    .catch((err) => global.logger.error(err));
  
module.exports = Server;
  