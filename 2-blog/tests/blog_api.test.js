const supertest = require("supertest")
const mongoose = require("mongoose")
const helpers = require("./test_helper.js")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")

const newBlog = {
  title: "Test Blog 5",
  author: "Test Author 5",
  url: "http://testurl5.com",
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helpers.initialBlogs)
})

describe("get actions", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-type", /application\/json/)
  })

  test("id property is defined", async () => {
    const response = await api.get("/api/blogs")
    expect(response.body[0].id).toBeDefined()
  })
})

describe("post actions", () => {
  test("blog is sucessfully added to the db", async () => {
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-type", /application\/json/)

    const blogList = await api.get("/api/blogs")
    expect(blogList.body).toHaveLength(helpers.initialBlogs.length + 1)
    expect(blogList.body[2].title).toBe("Test Blog 5")
  })

  test("if likes property is missing, likes are set to 0", async () => {
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-type", /application\/json/)

    const blogList = await api.get("/api/blogs")
    expect(blogList.body[2].likes).toBe(0)
  })

  test("if title and url properties are missing, response is 400", async () => {
    const incompleteBlog = {
      author: "Test Author 6",
      url: "  ",
      likes: 10,
    }
    api.post("api/blogs").send(incompleteBlog).expect(400)
  })
})

describe("delete actions", () => {
  test("blog is sucessfully deleted from db", async () => {
    const blogsList = await api.get("/api/blogs")
    await api.delete(`/api/blogs/${blogsList.body[1].id}`).expect(204)
    const updatedBlogList = await api.get("/api/blogs")
    expect(updatedBlogList.body).toHaveLength(helpers.initialBlogs.length - 1)
    const contents = updatedBlogList.body.map((c) => c.title)
    expect(contents).not.toContain(blogsList.body[1].title)
  })
})

describe("put actions", () => {
  test("blog is sucessfully updated", async () => {
    const blogList = await api.get("/api/blogs")
    const updatedBlog = {
      likes: 100
    }

    await api.put(`/api/blogs/${blogList.body[0].id}`).send(updatedBlog).expect(200)

    const newBlogList = await api.get("/api/blogs")
    console.log("newBlogList", newBlogList.body)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
