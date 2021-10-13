const express = require('express')
const passport = require('passport')
const router = express.Router()
const { authenticateUser, registerUser } = require('../controllers/controller')

router.post('/login', authenticateUser)

router.post('/signup', registerUser)

router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: 'You are successfully authenticated to this route!',
    })
  }
)

module.exports = router
