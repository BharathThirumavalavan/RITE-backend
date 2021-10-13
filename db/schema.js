const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: [true, 'Please Enter Email Address'],
  },
  hash: {
    type: String,
  },
  salt: String,
})

module.exports = mongoose.model('User', UserSchema)
