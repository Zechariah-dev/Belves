const fs = require('fs');
const BookRepository = require('../../database/repositories/book.repo');
const BookService = require('./book.serv');
const { createBookValidation } = require('./book.validation');
const cloudinary = require('../../utils/cloudinary');
const { escapeRegex } = require('../../utils');
const Logger = require('../../utils/pino');

const BookController = {
    async create(req, res) {
        try {
            const { body, user, files } = req;
            const { error } = createBookValidation(body);

            if (!files)
                return res
                    .status(400)
                    .json({ status: 'error', message: 'image is required' });

            let image_url;

            if (error) {
                return res.status(400).json({ status: 'error', errors });
            }

            const existing_book = await BookRepository.findOne({
                title: body.title,
                owner: user._id,
            });

            if (existing_book) {
                return res
                    .status(400)
                    .json({ message: `${body.title} already exists in your catalog` });
            }

            if (files) {
                const { path } = files[0];
                const newPath = await cloudinary.uploader.upload(path);
                image_url = newPath.secure_url;
                fs.unlinkSync(path);
            }

            const book = await BookService.createBook({
                ...body,
                owner: user._id,
                image_url,
            });

            return res.status(201).json({
                status: 'success',
                message: 'book created successfully',
                book,
            });
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async delete(req, res) {
        try {
            const { params, user } = req;

            const book = await BookRepository.findById(params.bookId);

            if (!book) {
                return res.status(404).json({ message: 'Book Not Found' });
            }

            if (book.owner.toString() !== user._id.toString()) {
                return res
                    .status(401)
                    .json({ status: 'error', message: 'Unauthorized' });
            }

            await book.remove();

            await cloudinary.uploader.destroy(book.image_url);

            return res.sendStatus(204);
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async update(req, res) {
        try {
            const { body, params, user } = req;
            const { error } = createBookValidation(body);

            if (error) {
                return res.status(400).json({ status: 'error', error });
            }

            let book = await BookRepository.findOne({
                _id: params.id,
                owner: user._id,
            });

            if (!book) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Book not present in your catalog',
                });
            }

            book = await BookRepository.updateOne({ _id: params.id }, body);

            return res.status(200).json({
                status: 'success',
                message: 'book updated successfully',
                book,
            });
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async fetchUserBooks(req, res) {
        try {
            const { user, query } = req;

            const { q, ...rest } = query;

            payload = rest;

            if (q) {
                payload.title = new RegExp(escapeRegex(query), 'gi');
            }

            const books = await BookRepository.filter({
                owner: user._id,
                ...payload,
            });

            if (!books) {
                return res
                    .status(404)
                    .json({ status: 'success', message: 'No book found' });
            }

            return res.status(200).json({
                status: 'success',
                message: "fetched user's books ",
                books,
            });
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async fetchBooks(req, res) {
        try {
            const { q, ...rest } = req.query;
            let query = rest;

            if (q) {
                query.title = new RegExp(escapeRegex(query), 'gi');
            }

            const books = await BookRepository.filter(query);

            return res
                .status(200)
                .json({ status: 'success', message: 'fetched books', books });
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async fetchSingleBook(req, res) {
        try {
            const { params } = req;

            const book = await BookRepository.findById(params.bookId);

            if (!book) {
                return res.status(404).json({ message: 'Book Not Found' });
            }

            return res
                .status(200)
                .json({ status: 'success', message: 'fetched single book', book });
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
};

module.exports = BookController;