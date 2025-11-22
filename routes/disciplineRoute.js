const express = require("express");
const router = express.Router();
const Discipline = require("../models/Discipline");

// GET all disciplines
router.get("/", async (req, res) => {
  try {
    const disciplines = await Discipline.find()
      .populate("module", "nom")
      .populate("enseignant", "nom");
    res.json(disciplines);
  } catch (err) {
    res.status(500).json({ error: "Impossible de récupérer les disciplines" });
  }
});

// GET single discipline by ID
router.get("/:id", async (req, res) => {
  try {
    const discipline = await Discipline.findById(req.params.id)
      .populate("module", "nom")
      .populate("enseignant", "nom");
    if (!discipline) return res.status(404).json({ error: "Discipline non trouvée" });
    res.json(discipline);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// CREATE a new discipline
router.post("/", async (req, res) => {
  try {
    const {
      nom,
      module,
      enseignant,
      niveau,
      volumeHoraireTotal,
      nbSeancesPrevues,
      evaluations
    } = req.body;

    const newDiscipline = new Discipline({
      nom,
      module,
      enseignant,
      niveau,
      volumeHoraireTotal,
      nbSeancesPrevues,
      evaluations: evaluations || []
    });

    const saved = await newDiscipline.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message || "Erreur lors de la création de la discipline" });
  }
});

// UPDATE discipline
router.put("/:id", async (req, res) => {
  try {
    const updated = await Discipline.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Discipline non trouvée" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || "Erreur lors de la mise à jour de la discipline" });
  }
});

// DELETE discipline
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Discipline.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Discipline non trouvée" });
    res.json({ message: "Discipline supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Impossible de supprimer la discipline" });
  }
});

module.exports = router;
