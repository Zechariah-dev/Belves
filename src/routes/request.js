const { Router } = require('express');
const RequestController = require('../components/request/request.ctrl');
const { auth } = require('../middlewares/auth');

const router = Router();

/**
 * @swagger
 * /api/request/{bookId}:
 *   post:
 *     summary: create a book request
 *     tags: ['Request']
 *     parameters:
 *     - in: path
 *       name: bookId
 *       required: true,
 *       scheme:
 *          type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *          description: Server Error
 */
router.post('/:bookId', auth, RequestController.createRequest);

/**
 * @swagger
 * /api/request/{requestId}:
 *   delete:
 *     summary: delete book request
 *     tags: ['Request']
 *     parameters:
 *     - in: path
 *       name: requestId
 *       required: true,
 *       scheme:
 *          type: string
 *     responses:
 *       204:
 *         description: No Content
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *          description: Server Error
 */
router.delete('/:requestId', auth, RequestController.deleteRequest);

/**
 * @swagger
 * /api/request/:
 *   get:
 *     summary: fetch all user request
 *     tags: ['Request']
 *     parameters:
 *     - in: query
 *       name: sort
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
router.get('/', auth, RequestController.fetchUserRequest);

/**
 * @swagger
 * /api/request/{requestId}:
 *   patch:
 *     summary: update a request
 *     tags: ['Request']
 *     parameters:
 *     - in: path
 *       name: requestId
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Not Authorized
 *       404:
 *          description: Not Found
 *       500:
 *          description: Server Error
 */
router.patch('/:requestId', auth, RequestController.updateRequest);

module.exports = router;
