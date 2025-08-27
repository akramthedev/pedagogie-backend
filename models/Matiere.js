const mongoose = require("mongoose");

const matiereSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true }, 
    enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Enseignant", required: true },
    classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Matiere", matiereSchema);
