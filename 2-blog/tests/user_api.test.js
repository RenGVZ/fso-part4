const mongoose = require("mongoose")
const superTest = require("supertest")
const app = require("../app")
const User = require("../models/user")

const api = superTest(app)

const initialUsers = [
  {
    username: "snorlaxxx",
    name: "Snorlax",
    passwordHash: "123456",
  },
  {
    username: "pikachu",
    name: "Pikachu",
    passwordHash: "123456",
  },
]

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(initialUsers)
})

describe("invalid user creation", () => {
  test("invalid username", async () => {
    const invalidUsername = {
      username: "b",
      name: "Biance",
      password: "123456",
    }

    await api
      .post("/api/users")
      .send(invalidUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const users = await User.find({})
    expect(users).toHaveLength(2)
  })

  test("password too short", async () => {
    const invalidPassword = {
      username: "bdad",
      name: "B",
      password: "",
    }

    await api
      .post('/api/users')
      .send(invalidPassword)
      .expect(400)

    const users = await User.find({})
    expect(users).toHaveLength(2)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
