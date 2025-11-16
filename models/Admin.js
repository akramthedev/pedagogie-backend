const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  phone: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
