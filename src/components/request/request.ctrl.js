const RequestRepository = require('../../database/repositories/request.repo');
const RequestService = require('./request.serv');
const BookRepository = require('../../database/repositories/book.repo');
const NotificationRepository = require('../../database/repositories/notification.repo');
const NotifcationService = require('../notification/notification.serv');
const { updateRequestValidation } = require('./request.validation');

const RequestController = {
    async createRequest(req, res) {
        try {
            const { user, params } = req;

            const book = await BookRepository.findById(params.bookId);

            if (book) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Book Not Found',
                });
            }

            const existing_request = await RequestRepository.findOne({
                book: book._id,
                user: user._id,
                owner: book.owner,
                status: 'Pending',
            });

            if (existing_request) {
                return res
                    .status(400)
                    .json({ message: 'An existing request for book exists' });
            }

            const payload = { user: user._id, owner: book.owner, book: book._id };

            const request = await RequestService.createRequest(payload);

            await NotifcationService.createNotification({
                user: request.owner,
                request: request._id,
                message: `You have a new book request from ${user.firstname} ${user.lastname} for ${book.title}. Kindly respond to this notification as soon a received`,
            });

            return res.status(201).json({ request });
        } catch (err) {
            Logger.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'An Error Occured ',
            });
        }
    },
    async deleteRequest(req, res) {
        try {
            const { user, params } = req;

            if (request.user.toString() !== user._id.toString()) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const request = await RequestRepository.findById(params.requestId);

            if (!request) {
                return res.status(404).json({ message: 'Request Not Found' });
            }

            await request.remove();

            await NotificationRepository.deleteOne({
                user: request.owner,
                request: request._id,
            });

            return res
                .status(200)
                .json({ status: 'success', message: 'book request deleted', request });
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async fetchUserRequest(req, res) {
        try {
            const { user, query } = req;

            const payload = { user: user._id, ...query };

            const requests = await RequestRepository.filter(payload);

            if (requests) {
                return res.status(404).json({
                    status: 'success',
                    message: ' No Requests Found ',
                });
            }

            return res.status(200).json({
                status: 'success',
                message: "fetched user's requests ",
                requests,
            });
        } catch (err) {
            Logger.error(err);
            return res.status(500).json({ message: 'An Error Occured' });
        }
    },
    async updateRequest(req, res) {
        try {
            const { user, params, body } = req;

            const { error, value } = updateRequestValidation(body);

            if (error) {
                return res.status(400).json({ status: 'error', error });
            }

            let request = await RequestRepository.findById(params.requestId);

            if (!request) {
                return res
                    .status(404)
                    .json({ status: 'error', message: 'Request Not Found' });
            }

            if (request.owner.toString() !== user._id.toString()) {
                return res
                    .status(401)
                    .json({ status: 'error', message: 'Unauthorized' });
            }

            request = await RequestRepository.updateOne({ _id: params.requestId }, {...value }, );

            await NotificationService.createNotificaion({
                user: request.user._id,
                message: `Your request for ${request.book.title} has been ${body.status}. You will be contact very soon to evaluate your method of delivery for the book`,
            });

            if (value.status === 'Accepted') {
                await NotificationService.createNotificaion({
                    user: request.owner._id,
                    message: `Here is ${request.user.firstname} ${request.user.lastname} details, \n Email: ${requst.user.email}, \n Contact: ${request.user.phone_number}. \n Kindly contact inorder to send the book `,
                });
            }

            return res.status(200).json({
                status: 'success',
                messsage: `request was ${value.status}`,
                request,
            });
        } catch (err) {
            Logger.error(err);
            return res.status(500).json({ status: 'error', message: 'An Error Occured' });
        }
    },
};

module.exports = RequestController;