const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { verifyToken, verifyAdmin } = require("../middlewares/auth");  

const Classe = require("../models/Classe");
const Discipline = require("../models/Discipline");
const Eleve = require("../models/Eleve");
const Enseignant = require("../models/Enseignant");
const Evaluation = require("../models/Evaluation");
const Module = require("../models/Module");
const Periode = require("../models/Periode");
const User = require("../models/User");

// ------------------- CLASSE -------------------

// Créer une classe
router.post("/classe", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const classe = await Classe.create(req.body);
    res.status(201).json(classe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lire toutes les classes
router.get("/classe", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const classes = await Classe.find().populate("eleves enseignant");
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lire une classe par ID
router.get("/classe/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.id).populate("eleves enseignant");
    res.json(classe);
  } catch (err) {
    res.status(404).json({ error: "Classe non trouvée" });
  }
});

// Mettre à jour une classe
router.put("/classe/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const classe = await Classe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(classe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer une classe
router.delete("/classe/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Classe.findByIdAndDelete(req.params.id);
    res.json({ message: "Classe supprimée" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------- DISCIPLINE -------------------

router.post("/discipline", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const discipline = await Discipline.create(req.body);
    res.status(201).json(discipline);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/discipline", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const disciplines = await Discipline.find().populate("module enseignants evaluations");
    res.json(disciplines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/discipline/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const discipline = await Discipline.findById(req.params.id).populate("module enseignants evaluations");
    res.json(discipline);
  } catch (err) {
    res.status(404).json({ error: "Discipline non trouvée" });
  }
});

router.put("/discipline/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const discipline = await Discipline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(discipline);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/discipline/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Discipline.findByIdAndDelete(req.params.id);
    res.json({ message: "Discipline supprimée" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------- ELEVE -------------------

router.post("/eleve", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const eleve = await Eleve.create(req.body);
    res.status(201).json(eleve);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/eleve", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const eleves = await Eleve.find().populate("classe seances");
    res.json(eleves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/eleve/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id).populate("classe seances");
    res.json(eleve);
  } catch (err) {
    res.status(404).json({ error: "Élève non trouvé" });
  }
});

router.put("/eleve/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const eleve = await Eleve.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(eleve);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/eleve/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Eleve.findByIdAndDelete(req.params.id);
    res.json({ message: "Élève supprimé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------- ENSEIGNANT -------------------

router.post("/enseignant", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const enseignant = await Enseignant.create(req.body);
    res.status(201).json(enseignant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/enseignant", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const enseignants = await Enseignant.find();
    res.json(enseignants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/enseignant/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id);
    res.json(enseignant);
  } catch (err) {
    res.status(404).json({ error: "Enseignant non trouvé" });
  }
});

router.put("/enseignant/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const enseignant = await Enseignant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(enseignant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/enseignant/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Enseignant.findByIdAndDelete(req.params.id);
    res.json({ message: "Enseignant supprimé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------- EVALUATION -------------------

router.post("/evaluation", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json(evaluation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/evaluation", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const evaluations = await Evaluation.find().populate("discipline");
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/evaluation/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id).populate("discipline");
    res.json(evaluation);
  } catch (err) {
    res.status(404).json({ error: "Évaluation non trouvée" });
  }
});

router.put("/evaluation/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const evaluation = await Evaluation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(evaluation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/evaluation/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Evaluation.findByIdAndDelete(req.params.id);
    res.json({ message: "Évaluation supprimée" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------- MODULE -------------------

router.post("/module", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const moduleObj = await Module.create(req.body);
    res.status(201).json(moduleObj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/module", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const modules = await Module.find().populate("disciplines");
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/module/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const moduleObj = await Module.findById(req.params.id).populate("disciplines");
    res.json(moduleObj);
  } catch (err) {
    res.status(404).json({ error: "Module non trouvé" });
  }
});

router.put("/module/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const moduleObj = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(moduleObj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/module/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.json({ message: "Module supprimé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------- PERIODE -------------------

router.post("/periode", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const periode = await Periode.create(req.body);
    res.status(201).json(periode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/periode", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const periodes = await Periode.find().populate("disciplines");
    res.json(periodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/periode/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const periode = await Periode.findById(req.params.id).populate("disciplines");
    res.json(periode);
  } catch (err) {
    res.status(404).json({ error: "Période non trouvée" });
  }
});

router.put("/periode/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const periode = await Periode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(periode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/periode/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Periode.findByIdAndDelete(req.params.id);
    res.json({ message: "Période supprimée" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------- USER -------------------

router.post("/user", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/user", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().populate("profile");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("profile");
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: "Utilisateur non trouvé" });
  }
});

router.put("/user/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/user/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
