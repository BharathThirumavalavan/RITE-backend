require('dotenv').config()

const express = require('express')
const passport = require('passport')
const router = require('./routers/router')
const cors = require('cors')
const { connectDB } = require('./db/dbConnect')

const app = new express()

connectDB(process.env.MONGO_URI)
require('./db/schema')

require('./config/passport')(passport)

app.use(
  cors({
    origin: 'http://127.0.0.1:3000/',
  })
)

app.use(passport.initialize())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', router)

app.use((err, req, res, next) => {
  if (err) {
    res.status(404).json({ success: false, msg: 'Error Occured' })
  }
})

app.listen(process.env.port, () => {
  console.log(`Server listening at port ${process.env.port}`)
})
