const mongoose = require("mongoose");

const enseignantSchema = new mongoose.Schema({
  nom: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  type: { type: String, enum: ["primaire", "secondaire"], required: false },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classe" }],
  disciplines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discipline" }],
  statut: { type: String, enum: ["En pause", "Actif", "Retraité"], default: "Actif" }
}, { timestamps: true });

module.exports = mongoose.model("Enseignant", enseignantSchema);
