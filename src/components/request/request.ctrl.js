const RequestRepository = require('../../database/repositories/request.repo');
const RequestService = require('./request.serv');
const BookRepository = require('../../database/repositories/book.repo');
const {  updateRequestValidation } = require('./request.validation');

const RequestController = {
    async createRequest(req, res) {
        try {
            const {  user, params } = req;

            const book = await BookRepository.findById(params.bookId);

            if (book) {
                return res.status(404).json({ message: 'Book Not Found'});
            }

            const existing_request = await RequestRepository.findOne({ book: book._id, user: user._id, owner: book.owner, status: 'Pending' })

            if (existing_request) {
                return res.status(400).json({ message: 'An existing request for book exists'})
            }

            const payload = { user: user._id, owner: book.owner, book: book._id }
            
            const request = await RequestService.createRequest(payload);

            return res.status(201).json({ request })
        } catch(err) {
            global.logger.error(err);
            return res.status(500).json({ message: 'An Error Occured'});
        }
    },
    async deleteRequest(req, res) {
        try {
            const { user, params } = req;

            if (request.user.toString() !== user._id.toString()) {
                return res.status(401).json({ message: 'Unauthorized'})
            }

            const request = await RequestRepository.findById(params.requestId);

            if (!request) {
                return res.status(404).json({ message: 'Request Not Found'})
            }

            await request.remove()

            return res.sendStatus(204);
        } catch(err) {
            global.logger.error(err);
            return res.status(500).json({ message: 'An Error Occured'})
        }
    },
    async fetchUserRequest(req, res) {
        try {
            const { user, query } = req;
            
            const payload = { user: user._id, ...query};

            const requests = await RequestRepository.filter(payload);

            if (requests) {
                return res.status(404).json({ message: 'No Requests Found'})
            }

            return res.status(200).json({ requests })
        } catch(err) {
            global.logger.error(err);
            return res.status(500).json({ message: 'An Error Occured'})
        }
    },
    async updateRequest(req, res) {
        try {
            const { user, params, body } = req;

            const { errors } = updateRequestValidation(body);

            if (errors) {
                return res.status(400).json({ errors })
            }

            let request = await RequestRepository.findById(params.requestId);
            if (!request) {
                return res.status(404).json({ message: 'Request Not Found'})
            }

            if (request.owner.toString() !==  user._id.toString()) {
                return res.status(401).json({ message: 'Unauthorized'})
            }
            
            request = await RequestRepository.updateOne({ _id: params.requestId}, { ...body });
            
            return res.sendStatus(204)
        } catch (err) {
            global.logge.error(err);
            return res.status(500).json({ message: 'An Error Occured'})
        }
    }
};

module.exports = RequestController;