const express = require("express");
const router = express.Router();
const Eleve = require("../models/Eleve");

// GET all élèves
router.get("/", async (req, res) => {
  try {
    const eleves = await Eleve.find()
      .populate("classe", "nom");
    res.json(eleves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single élève
router.get("/:id", async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id)
      .populate("classe", "nom");
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });
    res.json(eleve);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new élève
router.post("/", async (req, res) => {
  const { nom, prenom, classe, niveau, statut, moyenne } = req.body;
  const eleve = new Eleve({ nom, prenom, classe, niveau, statut, moyenne });
  try {
    const newEleve = await eleve.save();
    res.status(201).json(newEleve);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE élève
router.put("/:id", async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id);
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });

    const { nom, prenom, classe, niveau, statut, moyenne } = req.body;

    eleve.nom = nom ?? eleve.nom;
    eleve.prenom = prenom ?? eleve.prenom;
    eleve.classe = classe ?? eleve.classe;
    eleve.niveau = niveau ?? eleve.niveau;
    eleve.statut = statut ?? eleve.statut;
    eleve.moyenne = moyenne ?? eleve.moyenne;

    const updated = await eleve.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE élève
router.delete("/:id", async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id);
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });

    await Eleve.findByIdAndDelete(req.params.id);
    res.json({ message: "Élève supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
