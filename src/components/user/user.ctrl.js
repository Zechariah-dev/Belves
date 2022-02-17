const _ = require('lodash');
const UserRepository = require('../../database/repositories/user.repo');

const UserController = {
    async fetchUser(req, res) {
        try {
          return res.status(200).json({ user: req.user });
        } catch (err) {
          global.logger.error(err);
          return res.status(500).json({ message: 'An Error Occured'})
        }
      },
      async fetchAllUsers(req, res) {
        try {
          let users = await UserRepository.filter(req.query);
    
          if (!users) {
            return res.status(404).json({ message: 'No User Found'});
          }

          users = users.map((user) => {
              let pick = _.pick(user, ['firstname', 'lastname', 'email', 'faculty', 'institution', 'phone_number',  '_id'])
              return pick;
          })
    
          return res.status(200).json({ users });
        } catch(err) {
          global.logger.error(err);
          return res.status(500).json({ message: 'An Error Occured'})
        }
      }
};

module.exports = UserController;