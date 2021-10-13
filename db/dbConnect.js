const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async (URL) => {
  console.log('Connecting to Database...')
  return mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

module.exports = { connectDB }
