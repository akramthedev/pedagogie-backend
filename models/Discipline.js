const mongoose = require("mongoose");

const disciplineSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  volumeHoraireTotal: { type: Number, required: true },
  nbSeancesPrevues: { type: Number, required: true },
  evaluations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Evaluation" }]
}, { timestamps: true });

module.exports = mongoose.model("Discipline", disciplineSchema);
