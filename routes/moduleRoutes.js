const express = require("express");
const router = express.Router();
const Module = require("../models/Module");

// GET all modules
router.get("/", async (req, res) => {
  try {
    const modules = await Module.find().populate("disciplines");
    res.json(modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de récupérer les modules" });
  }
});

// GET a single module by ID
router.get("/:id", async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate("disciplines");
    if (!module) return res.status(404).json({ error: "Module non trouvé" });
    res.json(module);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST - create a new module
router.post("/", async (req, res) => {
  try {
    const { nom, niveau, disciplines, profs, description, status, effectif } = req.body;

    if (!nom || !niveau) {
      return res.status(400).json({ error: "Nom et niveau requis" });
    }

    const newModule = new Module({
      nom,
      niveau,
      disciplines: disciplines || [],
      profs: profs || [],
      description: description || "",
      status: status || "Actif",
      effectif: effectif || 0
    });

    const savedModule = await newModule.save();
    res.status(201).json(savedModule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de créer le module" });
  }
});

// PUT - update a module by ID
router.put("/:id", async (req, res) => {
  try {
    const { nom, niveau, disciplines, profs, description, status, effectif } = req.body;

    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      {
        nom,
        niveau,
        disciplines: disciplines || [],
        profs: profs || [],
        description: description || "",
        status: status || "Actif",
        effectif: effectif || 0
      },
      { new: true, runValidators: true }
    );

    if (!updatedModule) return res.status(404).json({ error: "Module non trouvé" });
    res.json(updatedModule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de mettre à jour le module" });
  }
});

// DELETE - delete a module by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);
    if (!deletedModule) return res.status(404).json({ error: "Module non trouvé" });
    res.json({ message: "Module supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de supprimer le module" });
  }
});

module.exports = router;
