const mongoose = require("mongoose");

const classeSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },  
    niveau: { type: String, enum: ["primaire", "secondaire"], required: true },
    eleves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Eleve" }],
    enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Enseignant" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classe", classeSchema);