const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../db/schema')
const { Buffer } = require('buffer')
require('dotenv').config()

const pathToKey = Buffer.from(
  process.env.PUBLIC_KEY_AUTHENTICATION_64,
  'base64'
)
const PUB_KEY = pathToKey.toString('utf-8')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
}

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, function (jwt_payload, done) {
      User.findOne({ _id: jwt_payload.sub }, function (err, user) {
        if (err) {
          return done(err, false)
        }
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
    })
  )
}
