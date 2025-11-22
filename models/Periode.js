const mongoose = require("mongoose");

const periodeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  niveau: { type: String, enum: ["primaire", "secondaire", "BTS", "collège", "lycée"], required: true },
  disciplines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discipline" }], 
      status: { type: String, enum: ["Actif", "En pause", "Archivé"], default: "Actif" },

}, { timestamps: true });

module.exports = mongoose.model("Periode", periodeSchema);
