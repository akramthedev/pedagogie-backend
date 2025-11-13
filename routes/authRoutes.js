const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Eleve = require("../models/Eleve");
const Enseignant = require("../models/Enseignant");

router.post("/register", async (req, res) => {
  try {
    const { email, password, role, nom, type } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email déjà utilisé" });

    let profile;
    let roleRef;
    if (role === "eleve") {
      profile = await Eleve.create({ nom });
      roleRef = "Eleve";
    } else if (role === "enseignant") {
      profile = await Enseignant.create({ nom, type });
      roleRef = "Enseignant";
    } else if (role === "admin") {
      profile = null;  
      roleRef = "Admin";
    } else {
      return res.status(400).json({ message: "Role invalide" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      profile: profile?._id,
      roleRef,
    });

    res.status(201).json({ message: "Utilisateur créé", userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, userId: user.profile },
      process.env.JWT_SECRET,
      { expiresIn: "900d" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      role: user.role,
      userId: user.profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
