const authRoute = require('./auth');
const userRoute = require('./user');

module.exports = (app) => {
  app.use('/api/auth', authRoute);
  app.use('/api/user', userRoute);
};
