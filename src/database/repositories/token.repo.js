const BaseRepository = require('../repository');
const Token = require('../models/token.model');

class TokenRepository extends BaseRepository {
  constructor() {
    super(Token);
  }
}

module.exports = new TokenRepository();
