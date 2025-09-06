const mongoose = require("mongoose");

const CommentaireSchema = new mongoose.Schema({
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
  commentaire: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Commentaire", CommentaireSchema);
