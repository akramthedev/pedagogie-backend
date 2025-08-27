const mongoose = require("mongoose");

const presenceSchema = new mongoose.Schema(
  {
    eleve: { type: mongoose.Schema.Types.ObjectId, ref: "Eleve", required: true },
    seance: { type: mongoose.Schema.Types.ObjectId, ref: "Seance" },
    segments : [{
      debut : Date, 
      fin : Date, 
      statut : Boolean   
    }],
    jour: { type: String },
    classe: { type: String },
  },
  { timestamps: true }
);

presenceSchema.index({ eleve: 1, seance: 1 }, { unique: true });


module.exports = mongoose.model("Presence", presenceSchema);
