const express = require("express");
const ctrl = require("../controllers/enseignantController");
const router = express.Router();




router.get("/classes/:enseignantId", ctrl.getSingleProfileWithClasses);
router.get("/seances/:enseignantId/:classId", ctrl.getSeances);



const Enseignant = require("../models/Enseignant");

// GET all enseignants
router.get("/", async (req, res) => {
  try {
    const enseignants = await Enseignant.find()
      .populate("classes", "nom")
      .populate("disciplines", "nom");
    res.json(enseignants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single enseignant
router.get("/:id", async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id)
      .populate("classes", "nom")
      .populate("disciplines", "nom");
    if (!enseignant) return res.status(404).json({ message: "Enseignant non trouvé" });
    res.json(enseignant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new enseignant
router.post("/", async (req, res) => {
  const { nom, email, type, classes, disciplines, statut } = req.body;
  const enseignant = new Enseignant({ nom, email, type, classes, disciplines, statut });
  try {
    const newEnseignant = await enseignant.save();
    res.status(201).json(newEnseignant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE enseignant
router.put("/:id", async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id);
    if (!enseignant) return res.status(404).json({ message: "Enseignant non trouvé" });

    const { nom, email, type, classes, disciplines, statut } = req.body;

    enseignant.nom = nom ?? enseignant.nom;
    enseignant.email = email ?? enseignant.email;
    enseignant.type = type ?? enseignant.type;
    enseignant.classes = classes ?? enseignant.classes;
    enseignant.disciplines = disciplines ?? enseignant.disciplines;
    enseignant.statut = statut ?? enseignant.statut;

    const updated = await enseignant.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE enseignant
router.delete("/:id", async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id);
    if (!enseignant) return res.status(404).json({ message: "Enseignant non trouvé" });

await Enseignant.findByIdAndDelete(req.params.id);
    res.json({ message: "Enseignant supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});








module.exports = router;