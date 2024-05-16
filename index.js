require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Could not connect to MongoDB", err));

app.get("/", (req, res) => {
  res.send("Sanctuary works - muhahahaha!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
