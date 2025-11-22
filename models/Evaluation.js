const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  niveau: { type: String, enum: ["primaire", "secondaire", "BTS", "collège", "lycée"], required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true },
  discipline: { type: mongoose.Schema.Types.ObjectId, ref: "Discipline", required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
  date: { type: Date, required: true },
  type: { type: String, enum: ["Devoir", "Examen"], required: true },
  coefficient: { type: Number, default: 1 },
  statut: { type: String, enum: ["Prévue", "Terminée", "En cours", "Corrigée"], default: "Prévue" },
  moyenneClasse: { type: Number, default: 0 },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }]
}, { timestamps: true });

module.exports = mongoose.model("Evaluation", evaluationSchema);
