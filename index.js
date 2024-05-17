require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Note = require("./models/Note");

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Could not connect to MongoDB", err));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
app.use(express.json());

// GET ALL NOTES
app.get("/", async (req, res) => {
  const result = await Note.find();
  return res.json(result);
});

// GET SINGLE NOTE
app.get("/:id", async (req, res) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        console.log("Note not found");
      } else {
        res.json(note);
      }
    })
    .catch((err) => console.error("Error finding note:", err));
});

// NEW NOTE
app.post("/new", async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      date: Date().now,
    });

    const savedNote = await note.save();

    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
