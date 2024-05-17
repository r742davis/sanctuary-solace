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
  try {
    const id = req.params.id;
    const foundNote = await Note.findById(req.params.id);

    if (!foundNote) res.json(`Cannot find Note with ID: ${id}`);
    else res.json(foundNote);
  } catch (error) {
    console.error("Note not found!", error);
    res.status(404).json({ error: error.message });
  }
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
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE NOTE
app.delete("/:id", async (req, res) => {
  try {
    const test = await Note.findOneAndDelete(req.params.id);

    res.status(200).json({ success: true, deletedNote: test._doc });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE SINGLE NOTE
app.put("/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: error.message });
  }
});
