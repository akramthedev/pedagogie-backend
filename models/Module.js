const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  niveau: { type: String, enum: ["primaire", "secondaire"], required: true },
  disciplines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discipline" }]
}, { timestamps: true });

module.exports = mongoose.model("Module", moduleSchema);
