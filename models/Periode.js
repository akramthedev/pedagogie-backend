const mongoose = require("mongoose");

const periodeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  disciplines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discipline" }]
}, { timestamps: true });

module.exports = mongoose.model("Periode", periodeSchema);
