const BaseRepository = require('../repository');
const Request = require('../models/request.model');

class RequestRepository extends BaseRepository {
    constructor() {
        super(Request);
    }
}

module.exports = new RequestRepository();