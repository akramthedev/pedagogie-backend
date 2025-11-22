const mongoose = require("mongoose");

const eleveSchema = new mongoose.Schema({
  nom: { type: String, required: false },
  prenom: { type: String, required: false },
  email: { type: String },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: false },
  niveau: { type: String, enum: ["primaire", "secondaire", "BTS", "collège", "lycée"], required: false },
  statut: { type: String, enum: ["Actif", "En pause", "Retiré"], default: "Actif" },
  moyenne: { type: Number, default: 0 },
  seances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seance" }]
}, { timestamps: true });

module.exports = mongoose.model("Eleve", eleveSchema);
