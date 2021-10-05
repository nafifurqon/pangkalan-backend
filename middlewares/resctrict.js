const passportJwt = require('../libs/passport_jwt');

const user = passportJwt.authenticate('jwt', {
  session: false,
});

module.exports = { user };
