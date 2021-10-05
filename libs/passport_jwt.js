const passportJwt = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { UserProfile } = require('../models');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:
    '18ab84d5ba44441582bbb8ed65cb9b35330781debfe7869f6a08104974b7411be17bfb47439513f9b0dd4a0298d9b08de091537ea93fcc05c1088a192f8ff785',
};

passportJwt.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await UserProfile.findByPk(payload.user_profile_id);

      if (user) done(null, user);
      else done(null, false);
    } catch (error) {
      done(error, false);
    }
  }),
);

module.exports = passportJwt;
