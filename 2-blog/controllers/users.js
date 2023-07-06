const bcrypt = require("bcrypt")
const userRoutes = require("express").Router()
const User = require("../models/user")

userRoutes.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 })
  res.json(users)
})

userRoutes.post("/", async (req, res) => {
  const { name, username, password } = req.body

  if(password.length < 3) {
    return res.status(400).json({ message: "password must be at least 3 characters long" })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await newUser.save()
  res.status(201).json(savedUser)
})

module.exports = userRoutes
