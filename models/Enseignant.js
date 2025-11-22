const mongoose = require("mongoose");

const enseignantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  type: { type: String, enum: ["primaire", "secondaire"], required: true },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classe" }],
  disciplines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discipline" }],
  statut: { type: String, enum: ["En pause", "Actif", "Retraité"], default: "Actif" }
}, { timestamps: true });

module.exports = mongoose.model("Enseignant", enseignantSchema);
