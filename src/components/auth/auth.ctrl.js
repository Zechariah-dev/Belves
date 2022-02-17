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
const { resetPasswordMail } =require('../../utils/mailjet')

const AuthController = {
  async signup(req, res) {
    try {
      const { errors } = signupValidation(req.body);

      if (errors) {
        return res.status(400).json({ errors });
      }

      const existing_user = await UserRepository.findOne({
        email: req.body.email,
      });

      if (existing_user) {
        return res
          .status(400)
          .json({ message: `${req.body.email} already in use` });
      }

      const new_user = await AuthService.createUser(req.body);

      const pick = _.pick(new_user, [
        'email',
        'firstname',
        'lastname',
        'phone_number',
        'institution',
        'faculty',
        '_id'
      ]);

      const token = generateToken({ email: new_user.email });

      return res.status(201).json({ user: pick, token });
    } catch (err) {
      global.logger.error(err);
      return res.status(500).json({ message: 'An Error Occured' });
    }
  },
  async login(req, res) {
    try {
      const { errors } = await loginValidation(req.body);

      if (errors) {
        return res.status(400).json({ errors });
      }

      const user = await UserRepository.findOne({ email: req.body.email });

      if (!user) {
        return res
          .status(404)
          .json({ message: `${req.body.email} is not linked to an account` });
      }

      const match = bcrypt.compareSync(req.body.password, user.password);

      if (!match) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      const pick = _.pick(user, [
        'email',
        'firstname',
        'lastname',
        'phone_number',
        'institution',
        'faculty',
        '_id'
      ]);

      const token = generateToken({ email: user.email });

      return res.status(200).json({ user: pick, token });
    } catch (err) {
      global.logger.error(err);
      return res.status(500).json({ message: 'An Error Occured' });
    }
  },
  async resetPassword(req, res) {
    try {
      const { errors } = await resetPasswordValidation(req.body);

      if (errors) {
        return res.status(400).json({ errors });
      }

      let user = await UserRepository.findOne({ email: req.body.email });

      if (!user) {
        return res
          .status(404)
          .json({ message: `${req.body.email} is not linked to any account` });
      }

      let hash = uuid();
      hash = hash.replace('-', '');

      const expiresIn = moment().add(15, 'minutes').format();

      const token_doc = await TokenRepository.create({
        type: 'Password reset',
        hash,
        expiresIn
      })

      resetPasswordMail(user, token_doc.hash);

      return res.sendStatus(200);
    } catch (err) {
      global.logger.error(err);
      return res.status(500).json({ message: 'An Error Occured' });
    }
  },
  async verifyToken(req, res) {
    try {
      const token_doc = await TokenRepository.findOne({ hash: req.params.token });

      if (!token_doc) {
        return res.status(400).json({ message: 'Invalid token' });
      }

      if (moment().isAfter(moment(token.expiresIn))) {
        return res.status(400).json({ message: 'Expired token' });
      }

      return res.sendStatus(200);
    } catch (err) {
      global.logger.error(err);
      return res.status(500).json({ message: 'An Error Occured' });
    }
  },
  async updatePassword(req, res) {
    try {
      const token_doc = await TokenRepository.findOne({ hash: req.params.token });

      if (!token_doc) {
        return res.status(400).json({ message: 'Invalid token' });
      }
      
      let user = await UserRepository.findById(token_doc.user);

      if (!user) {
        return res.status(400).json({ message: 'Invalid token' });
      }

      if (moment().isAfter(moment(token.expiresIn))) {
        return res.status(400).json({ message: 'Expired token' });
      }

      const { errors } = updatePasswordValidation(req.body);

      if (errors) {
        return res.status(400).json({ errors });
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      user.password = hash;

      await user.save();

      return res.sendStatus(200);
    } catch (err) {
      global.logger.error(err);
      return res.status(500).json({ message: 'An Error Occured' });
    }
  }
};

module.exports = AuthController;
