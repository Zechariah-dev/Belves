const { Router } = require('express');
const UserController = require('../components/user/user.ctrl');
const { auth } = require('../middlewares/auth');

const router = Router();


/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: fetch all users
 *     tags: ['User']
 *     parameters:
 *     - in: query
 *       name: faculty
 *       scheme:
 *         type: string
 *     - in: query
 *       name: institution
 *       scheme:    
 *          type: string
 *     - in: query
 *       name: page
 *       scheme:
 *         type: number
 *     - in: query
 *       name: limit
 *       scheme:
 *         type: number
 *     - in: query
 *       name: sort
 *       scheme:
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not Found
 *       500:
 *          description: Server Error
 */
 router.get('/', UserController.fetchAllUsers);

 /**
  * @swagger
  * /api/user/single:
  *   get:
  *     summary: fetch single user
  *     tags: ['User']
  *     responses:
  *       200:
  *         description: Ok
  *       404:
  *         description: Not Found
  *       500:
  *          description: Server Error
  */
 router.get('/single', auth, UserController.fetchUser);


 module.exports = router;