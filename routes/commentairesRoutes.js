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



router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log(`Fetching comments for student ID: ${studentId}`); 

    const commentaires = await Commentaire.find({ etudiant: studentId })
      .populate({
        path: "enseignant",
        select: "nom",
      })
      .populate({
        path: "etudiant",
        select: "nom prenom name",
      })
      .sort({ createdAt: -1 });
    console.log(`Comments found:`, commentaires); 

    const normalized = (commentaires || []).map((c) => ({
      _id: c._id,
      commentaire: c.commentaire,
      enseignant: c.enseignant?._id || c.enseignant,
      enseignantName: c.enseignant && c.enseignant.nom ? c.enseignant.nom : "",
      etudiant: c.etudiant?._id || c.etudiant,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.status(200).json(normalized);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
