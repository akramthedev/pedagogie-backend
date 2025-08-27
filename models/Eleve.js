const mongoose = require("mongoose");

const eleveSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe" },
    seances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seance" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Eleve", eleveSchema);
