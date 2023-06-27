const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://gavin_g3131:${password}@cluster0.ka6wa.gcp.mongodb.net/testNoteApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model("Notes", noteSchema)

// const note = new Note({
//   content: "Blah blah shit",
//   important: true,
// })

// note.save().then(() => {
//   console.log("note saved!")
// })

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
