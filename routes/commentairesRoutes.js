const express = require("express");
const router = express.Router();
const Commentaire = require("../models/Commentaire");

// Route POST pour ajouter un commentaire
router.post("/", async (req, res) => {
  try {
    const { seance, enseignant, etudiant, commentaire } = req.body;

    const newCommentaire = new Commentaire({
      seance,
      enseignant,
      etudiant,
      commentaire,
    });

    await newCommentaire.save();
    res.status(201).json({
      message: "Commentaire ajouté avec succès",
      commentaire: newCommentaire,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l’ajout du commentaire", error });
  }
});

// Route GET pour récupérer les commentaires d'un étudiant
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log(`Fetching comments for student ID: ${studentId}`); // Log student ID

    const commentaires = await Commentaire.find({ etudiant: studentId });
    console.log(`Comments found:`, commentaires); // Log fetched comments

    res.status(200).json(commentaires);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
