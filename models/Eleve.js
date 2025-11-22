const mongoose = require("mongoose");

const eleveSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true },
  niveau: { type: String, enum: ["primaire", "secondaire", "BTS", "collège", "lycée"], required: true },
  statut: { type: String, enum: ["Actif", "En pause", "Retiré"], default: "Actif" },
  moyenne: { type: Number, default: 0 },
  seances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seance" }]
}, { timestamps: true });

module.exports = mongoose.model("Eleve", eleveSchema);
