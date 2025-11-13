const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "enseignant", "eleve"], required: true },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "roleRef",
    },
    roleRef: {
      type: String,
      enum: ["Admin", "Enseignant", "Eleve"],
      required: true,
    },
    imgProfil: {
      type: String,
      default:
        "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Transparent-Image.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
