const notesRouter = require("express").Router()
const Note = require("../models/note")

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

notesRouter.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
    if (note) {
      console.log("req.params.id", req.params.id)
      res.json(note)
    } else {
      res.status(404).send({ error: "no id matches that" })
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.post("/", async (req, res, next) => {
  const body = req.body

  if (body.content === undefined)
    return res.status(400).json({ error: "content missing" })

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
  })

  try {
    const savedNote = await newNote.save()
    res.json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id
  try {
    const result = await Note.findByIdAndRemove(id)
    if (result) {
      res.status(204).end()
    } else {
      res.status(404).send({ error: "no id matches that" })
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.put("/:id", async (req, res, next) => {
  const { content, important } = req.body
  const id = req.params.id

  try {
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
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
