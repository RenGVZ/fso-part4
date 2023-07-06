const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getWebToken = (request) => {
  const authorization = request.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "")
  }
  return null
}

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post("/", async (req, res) => {
  const body = req.body

  const decodedToken = jwt.verify(getWebToken(req), process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" })
  }
  const user = await User.findById(decodedToken.id)

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  }
  if (newBlog.likes === undefined) {
    newBlog.likes = 0
  }

  if (
    !newBlog.title ||
    newBlog.title.trim().length === 0 ||
    !newBlog.url ||
    newBlog.url.trim().length === 0
  ) {
    return res.status(400).end()
  }

  const blog = new Blog(newBlog)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id
  await Blog.findByIdAndRemove(id)
  res.status(204).end()
})

blogsRouter.put("/:id", async (req, res) => {
  const id = req.params.id
  const { title, author, url, likes } = req.body
  console.log("title", title, "author", author, "url", url, "likes", likes)
  const blogToUpdate = await Blog.findByIdAndUpdate(
    id,
    {
      // if there is a title, add this to the update object. If not, don't include it
      ...(title && { title }),
      ...(author && { author }),
      ...(url && { url }),
      ...(likes && { likes }),
    },
    { new: true, runValidators: true, context: "query" }
  )
  if (blogToUpdate) {
    res.json(blogToUpdate)
  } else {
    res.status(404).send({ error: "no id matches that" })
  }
})

module.exports = blogsRouter
