const mongoose = require("mongoose");

const classeSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    code: { type: String, unique: true },
    niveau: { type: String, enum: ["primaire", "secondaire", "BTS", "collège", "lycée"], required: true },
    prof: { type: String }, 
    subjects: [{ type: String }],  
    room: { type: String },
    schedule: { type: String },  
    eleves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Eleve" }],
    capacity: { type: Number, default: 30 },
    effectif: { type: Number, default: 0 },
    moyenne: { type: Number, default: 0 },
    presenceRate: { type: Number, default: 0 },
    status: { type: String, enum: ["Actif", "En pause", "Archivé"], default: "Actif" },
    enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Enseignant" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classe", classeSchema);
