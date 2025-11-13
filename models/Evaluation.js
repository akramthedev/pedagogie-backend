const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  discipline: { type: mongoose.Schema.Types.ObjectId, ref: "Discipline", required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["Devoir", "Examen"], required: true },
  coefficient: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("Evaluation", evaluationSchema);
