const BookRepository = require('../../database/repositories/book.repo');

const BookService = {
    createBook(payload) {
        return BookRepository.create({ ...payload});
    }
}

module.exports = BookService;