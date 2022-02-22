const RequestRepository = require('../../database/repositories/request.repo');

const RequestService = {
    createRequest(payload) {
        return RequestRepository.create(payload);
    }
}

module.exports = RequestService;