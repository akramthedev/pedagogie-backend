const mongoose = require("mongoose");

const disciplineSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Enseignant" },
  niveau: { type: String, enum: ["primaire", "secondaire", "BTS", "collège", "lycée"], required: true },
  volumeHoraireTotal: { type: Number, required: true },
  nbSeancesPrevues: { type: Number, required: true },
  evaluations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Evaluation" }],
  status: { type: String, enum: ["Actif", "En pause", "Archivé"], default: "Actif" },
}, { timestamps: true });

module.exports = mongoose.model("Discipline", disciplineSchema);
