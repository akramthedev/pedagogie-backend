const mongoose = require("mongoose");

const RetardSchema = new mongoose.Schema({
  seance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seance",
    required: true,
  },
  enseignant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enseignant",
    required: true,
  },
  etudiant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Eleve",
    required: true,
  },
  heureEntree: {
    type: Date,
    required: true,
  },
  margeRetard: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Retard", RetardSchema);
