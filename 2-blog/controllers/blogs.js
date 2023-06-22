const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", (req, res) => {
  Blog.find({})
    .then((blogs) => {
      res.json(blogs)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).end()
    })
})

blogsRouter.post("/", (req, res) => {
  console.log('req.body');
  const blog = new Blog(req.body)
  blog
    .save()
    .then((blog) => {
      res.status(201).json(blog)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).end()
    })
})

module.exports = blogsRouter