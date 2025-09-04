const mongoose = require("mongoose");

const eleveSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe" },
    seances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seance" }],
    imgProfil: {
      type: String,
      default:
        "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Transparent-Image.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Eleve", eleveSchema);
