const { Router } = require('express');
const NotificationController = require('../components/notification/notification.ctrl');
const { auth } = require('../middlewares/auth');

const router = Router();

/**
 * @swagger
 * /api/notificationr:
 *   get:
 *     summary: get user notification
 *     tags: ['Notification']
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not Found
 *       500:
 *          description: Server Error
 */
router.get('/', auth, NotificationController.getUserNotifications);

/**
 * @swagger
 * /api/notification/{notificationId}:
 *   patch:
 *     summary: read nonotification
 *     tags: ['Notification']
 *     parameters:
 *     - in: path
 *       name: notificationId
 *       required: true
 *       scheme:
 *          type: string
 *     responses:
 *       204:
 *         description: No Data
 *       500:
 *          description: Server Error
 */
router.patch('/:notificationId', auth, NotificationController.readNotification);

/**
 * @swagger
 * /api/notification/{notificationId}:
 *   delete:
 *     summary: delete single notification
 *     tags: ['Notification']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       204:
 *         description: No data
 *       500:
 *          description: Server Error
 */
router.delete('/:notificationId', auth, NotificationController.deleteNotication);

/**
 * @swagger
 * /api/notification:
 *   delete:
 *     summary: delete all notification
 *     tags: ['Notification']
 *     responses:
 *       204:
 *         description: Ok
 *       500:
 *          description: Server Error
 */
router.delete('/', auth, NotificationController.deleteAllNotification);

module.exports = router;