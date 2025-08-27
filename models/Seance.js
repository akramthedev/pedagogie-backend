const mongoose = require("mongoose");

const seanceSchema = new mongoose.Schema(
  {
    classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe", required: true },
    // matiere: { type: mongoose.Schema.Types.ObjectId, ref: "Matiere", required: true },
    enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Enseignant", required: true },
    debut: { type: Date, required: true },
    fin: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seance", seanceSchema);
