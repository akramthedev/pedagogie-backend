const express = require("express");
const router = express.Router();
const Periode = require("../models/Periode");
const Discipline = require("../models/Discipline");

// GET all périodes
router.get("/", async (req, res) => {
  try {
    const periodes = await Periode.find()
      .populate("disciplines", "nom niveau module enseignant")
      .sort({ createdAt: -1 });
    res.json(periodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single période by ID
router.get("/:id", async (req, res) => {
  try {
    const periode = await Periode.findById(req.params.id)
      .populate("disciplines", "nom niveau module enseignant");
    if (!periode) return res.status(404).json({ error: "Période non trouvée" });
    res.json(periode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new période
router.post("/", async (req, res) => {
  try {
    const { nom, dateDebut, dateFin, niveau, disciplines, status } = req.body;
    if (!nom || !dateDebut || !dateFin || !niveau) {
      return res.status(400).json({ error: "Nom, dates et niveau sont requis" });
    }

    const newPeriode = new Periode({
      nom,
      dateDebut,
      dateFin,
      niveau,
      status, 
      disciplines: Array.isArray(disciplines) ? disciplines : []
    });

    const saved = await newPeriode.save();
    const populated = await saved.populate("disciplines", "nom niveau module enseignant");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE période
router.put("/:id", async (req, res) => {
  try {
    const { nom, dateDebut, dateFin, niveau, disciplines, status} = req.body;
    const updated = await Periode.findByIdAndUpdate(
      req.params.id,
      {
        nom,
        dateDebut,
        dateFin,
        niveau,
        status, 
        disciplines: Array.isArray(disciplines) ? disciplines : []
      },
      { new: true, runValidators: true }
    ).populate("disciplines", "nom niveau module enseignant");

    if (!updated) return res.status(404).json({ error: "Période non trouvée" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE période
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Periode.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Période non trouvée" });
    res.json({ message: "Période supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
