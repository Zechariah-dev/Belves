const _ = require('lodash');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const moment = require('moment');
const UserRepository = require('../../database/repositories/user.repo');
const TokenRepository = require('../../database/repositories/token.repo');
const AuthService = require('./auth.serv');
const {
    signupValidation,
    loginValidation,
    resetPasswordValidation,
    updatePasswordValidation,
} = require('./auth.validation');
const { generateToken } = require('../../utils/jwt');
const { resetPasswordMail } = require('../../utils/mailjet');
const Logger = require('../../utils/pino');
const NotificationService = require('../notification/notification.serv');

const AuthController = {
    async signup(req, res) {
        try {
            const { error, value } = signupValidation(req.body);

            if (error) {
                return res.status(400).json({ status: 'error', error });
            }

            const existing_user = await UserRepository.findOne({
                email: value.email,
            });

            if (existing_user) {
                return res.status(400).json({
                    status: 'error',
                    message: `${req.body.email} already in use`,
                });
            }

            const new_user = await AuthService.createUser(value);

            const pick = _.pick(new_user, [
                'email',
                'firstname',
                'lastname',
                'phone_number',
                'institution',
                'faculty',
                '_id',
            ]);

            await NotificationService.createNotification({
                user: user._id,
                title: 'Welcome to Belves',
            });

            return res.status(201).json({
                status: 'success',
                message: 'registration successful',
                user: pick,
            });
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async login(req, res) {
        try {
            const { error } = await loginValidation(req.body);

            if (error) {
                return res.status(400).json({ status: 'error', error });
            }

            const user = await UserRepository.findOne({ email: req.body.email });

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: `${req.body.email} is not linked to an account`,
                });
            }

            const match = bcrypt.compareSync(req.body.password, user.password);

            if (!match) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Incorrect password',
                });
            }

            const pick = _.pick(user, [
                'email',
                'firstname',
                'lastname',
                'phone_number',
                'institution',
                'faculty',
                '_id',
            ]);

            const token = generateToken({ email: user.email });

            return res.status(200).json({
                status: 'success',
                message: 'login successful',
                user: pick,
                token,
            });
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async resetPassword(req, res) {
        try {
            const { error, value } = await resetPasswordValidation(req.body);

            if (error) {
                return res.status(400).json({ error });
            }

            let user = await UserRepository.findOne({ email: req.body.email });

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: `${req.body.email} is not linked to any account`,
                });
            }

            let hash = uuid();
            hash = hash.replace('-', '');

            const expiresIn = moment().add(15, 'minutes').format();

            const token_doc = await TokenRepository.create({
                type: 'Password reset',
                hash,
                expiresIn,
            });

            resetPasswordMail(user, token_doc.hash);

            return res
                .status(200)
                .json({ status: 'success', message: 'password reset mail sent' });
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async verifyToken(req, res) {
        try {
            const token_doc = await TokenRepository.findOne({
                hash: req.params.token,
            });

            if (!token_doc) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid token ',
                });
            }

            if (moment().isAfter(moment(token.expiresIn))) {
                return res
                    .status(400)
                    .json({ status: 'error', message: 'Expired token' });
            }

            return res.sendStatus(200);
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
    async updatePassword(req, res) {
        try {
            const token_doc = await TokenRepository.findOne({
                hash: req.params.token,
            });

            if (!token_doc) {
                return res
                    .status(400)
                    .json({ status: 'error', message: 'Invalid token' });
            }

            let user = await UserRepository.findById(token_doc.user);

            if (!user) {
                return res
                    .status(400)
                    .json({ status: 'error', message: 'Invalid token' });
            }

            if (moment().isAfter(moment(token.expiresIn))) {
                return res
                    .status(400)
                    .json({ status: 'error', message: 'Expired token' });
            }

            const { error, value } = updatePasswordValidation(req.body);

            if (error) {
                return res.status(400).json({ status: 'error', error });
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(value.password, salt);

            user.password = hash;

            await user.save();

            return res.sendStatus(200);
        } catch (err) {
            Logger.error(err);
            return res
                .status(500)
                .json({ status: 'error', message: 'An Error Occured' });
        }
    },
};

module.exports = AuthController;