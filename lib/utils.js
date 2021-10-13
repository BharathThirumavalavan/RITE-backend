const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const { Buffer } = require('buffer')
require('dotenv').config()

//Validating Password

const validPassword = (password, hash, salt) => {
  let hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex')

  return hashVerify === hash
}

//Generate password and hashing to be stored in DB

const genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString('hex')
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex')

  return {
    salt: salt,
    hash: genHash,
  }
}

//expiration has been set to a day 86400000ms in a day

const issueJWT = (user) => {
  const key64 = Buffer.from(process.env.PRIVATE_KEY_AUTHENTICATION_64, 'base64')
  const PRIV_KEY = key64.toString('utf8')

  const expiresIn = Date.now() + 86400000
  const payload = {
    sub: user._id,
    iat: Date.now(),
  }

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: 'RS256',
  })

  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn,
  }
}

module.exports.validPassword = validPassword
module.exports.genPassword = genPassword
module.exports.issueJWT = issueJWT
