const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Eleve = require("../models/Eleve");
const Enseignant = require("../models/Enseignant");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("profile");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("profile");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new user
router.post("/", async (req, res) => {
  try {
    const { email, password, role, nom, type } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    let profile = null;
    let roleRef = "Eleve";

    if (role === "eleve" || role === "Eleve") {
      profile = await Eleve.create({ nom });
      roleRef = "Eleve";
    } else if (role === "enseignant" || role === "enseignant") {
      profile = await Enseignant.create({ nom, type });
      roleRef = "Enseignant";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      profile: profile?._id,
      roleRef,
    });

    res.status(201).json({ message: "Utilisateur créé", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const { email, password, role, profile, roleRef, imgProfil } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10); // hash if new password
    if (role) user.role = role;
    if (roleRef) user.roleRef = roleRef;
    if (profile) user.profile = profile;
    if (imgProfil) user.imgProfil = imgProfil;

    const updatedUser = await user.save();
    const populatedUser = await updatedUser.populate("profile");
    res.json(populatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
