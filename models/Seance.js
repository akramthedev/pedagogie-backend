const mongoose = require("mongoose");

const seanceSchema = new mongoose.Schema(
  {
    classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true },
    discipline: { type: mongoose.Schema.Types.ObjectId, ref: "Discipline", required: false },
    enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Enseignant", required: false },
    debut: { type: Date, required: true },
    fin: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seance", seanceSchema);
