const express = require("express");
const router = express.Router();
const Retard = require("../models/Retard");

// Route POST pour ajouter un retard
router.post("/", async (req, res) => {
  try {
    const { seance, enseignant, etudiant, heureEntree, margeRetard } = req.body;

    const retard = new Retard({
      seance,
      enseignant,
      etudiant,
      heureEntree,
      margeRetard,
    });

    await retard.save();
    res.status(201).json({ message: "Retard ajouté avec succès", retard });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l’ajout du retard", error });
  }
});

module.exports = router;
