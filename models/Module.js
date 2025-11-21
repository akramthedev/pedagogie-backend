const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  niveau: { type: String, enum: ["primaire", "secondaire"], required: true },
  disciplines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discipline" }],
  profs: [{ type: String }], 
  description: { type: String, default: "" },
  status: { type: String, enum: ["Actif", "En pause", "Archivé"], default: "Actif" },
  effectif: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Module", moduleSchema);
