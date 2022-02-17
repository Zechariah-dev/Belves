const mongoose = require('mongoose');
require('dotenv').config();

const Database = {
  async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      global.logger.info('Belves -> Database Connected');
    } catch (error) {
      global.logger.error('Belves -> Error connecting to DB');
      global.logger.error(error.message);
      throw error;
    }
  },
};

module.exports = Object.freeze(Database);
