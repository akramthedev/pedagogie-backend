const mongoose = require("mongoose");

const enseignantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String, enum: ["primaire", "secondaire"], required: true },
});

module.exports = mongoose.model("Enseignant", enseignantSchema);
