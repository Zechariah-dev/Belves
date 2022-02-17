const _ = require('lodash');
const { verifyToken } = require('../utils/jwt');
const UserRepository = require('../database/repositories/user.repo');

exports.auth = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    token = token.split(' ')[1];

    const { email } = verifyToken(token);
    
    let user = await UserRepository.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized'});
    }

    user = _.pick(user,  [
      'email',
      'firstname',
      'lastname',
      'phone_number',
      'institution',
      'faculty',
      '_id'
    ])

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
