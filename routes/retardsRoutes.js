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

// Route GET pour récupérer les retards d'un étudiant
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const retards = await Retard.find({ etudiant: studentId })
      .populate({ path: "enseignant", select: "nom" })
      .populate({ path: "seance", select: "debut fin" })
      .sort({ createdAt: -1 });

    const normalized = (retards || []).map((r) => ({
      _id: r._id,
      enseignantName: r.enseignant?.nom || "",
      margeRetard: r.margeRetard,
      heureEntree: r.heureEntree,
      seance: r.seance?._id || r.seance,
      seanceStart: r.seance?.debut || null,
      seanceEnd: r.seance?.fin || null,
      createdAt: r.createdAt,
    }));

    res.status(200).json(normalized);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des retards" });
  }
});

module.exports = router;
