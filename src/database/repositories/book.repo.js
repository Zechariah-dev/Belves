const BaseRepository = require('../repository');
const Book = require('../models/book.model');

class BookRepository extends BaseRepository {
    constructor() {
        super(Book);
    }
}

module.exports = new BookRepository();