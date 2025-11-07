const mongoose = require("mongoose");

const candSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  pos: { type: String, required: true },
  cur: { type: String, required: true },
  yrs: { type: String, required: true },
  resumeId: { type: String, required: true }, // changed to String
  videoId: { type: String, required: true }, // changed to String
});

module.exports = mongoose.model("Cand", candSchema);
