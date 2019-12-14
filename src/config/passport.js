import 'dotenv/config'
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt

// load up the user model
const models = require('../models')
const User = models.User

module.exports = function(passport) {
  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.JWT_SECRET, // pass jwt
  }
  passport.use(
    'jwt',
    new JwtStrategy(jwtOpts, async function(jwt_payload, done) {
      try {
        const user = await User.findById(jwt_payload._id)
        if (!user) {
          return done(null, false)
        }
        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    })
  )
}
