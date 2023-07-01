const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const helpers = require("./test_helper.js")
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogsObject = helpers.initialBlogs.map((blog) => new Blog(blog))
  const promiseAray = blogsObject.map((blog) => blog.save())
  await Promise.all(promiseAray)
})

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-type", /application\/json/)
}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})
