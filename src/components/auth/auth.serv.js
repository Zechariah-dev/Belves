const UserRepository = require('../../database/repositories/user.repo');

const AuthService = {
  createUser(payload) {
    return UserRepository.create({ ...payload });
  },
};

module.exports = AuthService;