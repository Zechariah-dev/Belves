require('dotenv').config();
const mongoose = require('mongoose');
const Logger = require('../utils/pino');

const Database = {
    async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            Logger.info('Belves -> Database Connected');
        } catch (error) {
            Logger.error('Belves -> Error connecting to DB');
            Logger.error(error.message);
            throw error;
        }
    },
};

module.exports = Object.freeze(Database);