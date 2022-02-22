const authRoute = require('./auth');
const userRoute = require('./user');
const bookRoute = require('./book');
const requestRoute = require('./request');

module.exports = (app) => {
  app.use('/api/auth', authRoute);
  app.use('/api/user', userRoute);
  app.use('/api/book', bookRoute);
  app.use('/api/request', requestRoute);
};
