const notesRouter = require("express").Router()
const Note = require("../models/note")
const User = require("../models/user")

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 })

  response.json(notes)
})

notesRouter.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id)
  if (note) {
    console.log("req.params.id", req.params.id)
    res.json(note)
  } else {
    res.status(404).end()
  }
})

notesRouter.post("/", async (req, res) => {
  const body = req.body
  const user = await User.findById(body.userId)

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  })

  const savedNote = await newNote.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  res.status(201).json(savedNote)
})

notesRouter.delete("/:id", async (req, res) => {
  const id = req.params.id
  await Note.findByIdAndRemove(id)
  res.status(204).end()
})

notesRouter.put("/:id", async (req, res) => {
  const { content, important } = req.body
  const id = req.params.id

  const update = await Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
  if (update) {
    res.json(update)
  } else {
    res.status(404).send({ error: "no id matches that" })
  }
})

module.exports = notesRouter
