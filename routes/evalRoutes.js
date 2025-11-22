const express = require("express");
const router = express.Router();
const Evaluation = require("../models/Evaluation");

// GET all evaluations
router.get("/", async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate("classe")
      .populate("discipline")
      .populate("module");
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one evaluation by ID
router.get("/:id", async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate("classe")
      .populate("discipline")
      .populate("module");
    if (!evaluation) return res.status(404).json({ message: "Évaluation introuvable" });
    res.json(evaluation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new evaluation
router.post("/", async (req, res) => {
  const evaluation = new Evaluation({
    nom: req.body.nom,
    niveau: req.body.niveau,
    classe: req.body.classe,
    discipline: req.body.discipline,
    module: req.body.module,
    date: req.body.date,
    type: req.body.type,
    coefficient: req.body.coefficient,
    statut: req.body.statut
  });

  try {
    const newEvaluation = await evaluation.save();
    res.status(201).json(newEvaluation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update evaluation
router.put("/:id", async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: "Évaluation introuvable" });

    Object.assign(evaluation, req.body);
    const updatedEvaluation = await evaluation.save();
    res.json(updatedEvaluation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE evaluation
router.delete("/:id", async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: "Évaluation introuvable" });

    await evaluation.remove();
    res.json({ message: "Évaluation supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
