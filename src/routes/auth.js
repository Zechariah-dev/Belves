const { Router } = require('express');
const AuthController = require('../components/auth/auth.ctrl');

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: user registration
 *     tags: ['Auth']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstname
 *               - lastname
 *               - institution
 *               - faculty
 *               - phone_number
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               firstname:
 *                  type: string
 *               lastname:
 *                  type: string
 *               institution:
 *                  type: string
 *               faculty:
 *                  type: string
 *               phone_number:
 *                  type: string
 *               password:
 *                  type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *          description: Server Error
 */
router.post('/register', AuthController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: login user
 *     tags: ['Auth']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *          description: Server Error
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: reset user password
 *     tags: ['Auth']
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
 *       200:
 *         description: Ok
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *          description: Server Error
 */
router.post('/reset-password', AuthController.resetPassword);

/**
 * @swagger
 * /api/auth/verify-token/{token}:
 *   get:
 *     summary: verify password reset token
 *     tags: ['Auth']
 *     parameters:
 *     - in: path
 *       name: token
 *       required: true
 *       scheme:
 *          type: string
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *          description: Server Error
 */
router.get('/verify-token/:token', AuthController.verifyToken);

/**
 * @swagger
 * /api/auth/update-password/{token}:
 *   patch:
 *     summary: update user password
 *     tags: ['Auth']
 *     parameters:
 *     - in: path
 *       name: token
 *       required: true
 *       scheme:
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Bad Request
 *       500:
 *          description: Server Error
 */
router.patch('/update-password/:token', AuthController.updatePassword);

module.exports = router;