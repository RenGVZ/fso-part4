const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRoutes = require('./controllers/blogs')

mongoose.set("strictQuery", false)

mongoose.connect(config.MONGO_URL).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

app.use('/api/blogs', blogRoutes)
app.use(cors())
app.use(express.json())

module.exports = app