const { Router } = require('express');
const BookController = require('../components/book/book.ctrl');
const { auth } = require('../middlewares/auth');
const upload = require('../utils/multer');

const router = Router();

/**
 * @swagger
 * /api/book/:
 *   post:
 *     summary: create a new book
 *     tags: ['Book']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - faculty
 *               - institution
 *             properties:
 *               title:
 *                 type: string
 *               descriptton:
 *                  type: string
 *               faculty:
 *                  type: string
 *               institution:
 *                  type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *          description: Server Error
 */
router.post('/', [auth, upload.array('images')], BookController.create);

/**
 * @swagger
 * /api/book/{bookId}:
 *   delete:
 *     summary: delete book
 *     tags: ['Book']
 *     parameters:
 *     - in: path
 *       name: bookId
 *       required: true
 *       scheme:
 *          type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *          description: Server Error
 */
router.delete('/:bookId', auth, BookController.delete);

/**
 * @swagger
 * /api/book/{bookId}:
 *   patch:
 *     summary: update a book
 *     tags: ['Book']
 *     parameters:
 *     - in: path
 *       name: bookId
 *       required: true
 *       scheme:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               descriptton:
 *                  type: string
 *               faculty:
 *                  type: string
 *               institution:
 *                  type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *          description: Server Error
 */
router.patch('/:bookId', auth, BookController.update);

/**
 * @swagger
 * /api/book/owner:
 *   get:
 *     summary: fetch user book
 *     tags: ['Book']
 *     parameters:
 *     - in: query
 *       name: institution
 *       scheme:
 *          type: string
 *     - in: query
 *       name: faculty
 *       scheme:
 *          type: string
 *     - in: query
 *       name: sort
 *       scheme:
 *          type: string
 *     - in: query
 *       name: q
 *       scheme:
 *          type: string

 *     responses:
 *       200:
 *         description: Created
 *       404:
 *         description: Bad Request
 *       500:
 *          description: Server Error
 */
router.get('/owner', auth, BookController.fetchUserBooks);

/**
 * @swagger
 * /api/book/:
 *   get:
 *     summary: fetch all book
 *     tags: ['Book']
 *     parameters:
 *     - in: query
 *       name: institution
 *       scheme:
 *          type: string
 *     - in: query
 *       name: faculty
 *       scheme:
 *          type: string
 *     - in: query
 *       name: sort
 *       scheme:
 *          type: string
 *     - in: query
 *       name: q
 *       scheme:
 *          type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not Found
 *       500:
 *          description: Server Error
 */
router.get('/', BookController.fetchBooks);

/**
 * @swagger
 * /api/book/{bookId}:
 *   get:
 *     summary: fetch single book
 *     tags: ['Book']
 *     parameters:
 *     - in: path
 *       name: bookId
 *       required: true
 *       scheme:
 *          type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not Found
 *       500:
 *          description: Server Error
 */
router.get('/:bookId', BookController.fetchSingleBook)

module.exports = router;