const utils = require('../lib/utils')
const User = require('../db/schema')

const registerUser = async (req, res, next) => {
  const checkUser = await User.findOne({ emailAddress: req.body.emailAddress })
  if (checkUser?._id) {
    res
      .status(200)
      .json({ success: false, msg: 'Email Address already registered' })
  } else {
    const saltHash = utils.genPassword(req.body.password)
    const salt = saltHash.salt
    const hash = saltHash.hash
    const newUser = await User.create({
      emailAddress: req.body.emailAddress,
      hash: hash,
      salt: salt,
    })
    if (newUser?._id) {
      res
        .status(200)
        .json({
          success: true,
          msg: 'Account created successfully. Please wait you will be redirected to Login',
        })
    } else {
      res.status(500).json({ success: false, msg: 'Unable to connect' })
    }
  }
}

const authenticateUser = async (req, res) => {
  const checkUser = await User.findOne({ emailAddress: req.body?.emailAddress })
  if (!checkUser) {
    res
      .status(404)
      .json({ success: false, msg: 'Email address not registered' })
  } else {
    const isValid = utils.validPassword(
      req.body.password,
      checkUser.hash,
      checkUser.salt
    )
    if (isValid) {
      const tokenObject = utils.issueJWT(checkUser)
      res.status(200).json({
        success: true,
        msg: 'Login Successful',
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      })
    } else {
      res.status(401).json({
        success: false,
        msg: 'Incorrect Password. Try again or click Forgot password to reset it.',
      })
    }
  }
}

module.exports = { authenticateUser, registerUser }
