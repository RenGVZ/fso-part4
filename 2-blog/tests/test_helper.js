const Blog = require("../models/blog")

const initialBlogs = [
  {
    title: "Test Blog 3",
    author: "Test Autho 3",
    url: "http://testurl3.com",
    likes: 3,
  },
  {
    title: "Test Blog 4",
    author: "Test Author 4",
    url: "http://testurl2.com",
    likes: 4,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const getBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  getBlogs,
}
