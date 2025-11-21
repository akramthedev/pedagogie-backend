const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Classe = require('../models/Classe');
const Enseignant = require('../models/Enseignant');

const ALLOWED_NIVEAUX = ['primaire','secondaire','BTS','collège','lycée'];

// GET all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Classe.find().populate('eleves enseignant');
    return res.status(200).json(classes);
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET single class
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const classe = await Classe.findById(id).populate('eleves enseignant');
    if (!classe) return res.status(404).json({ error: 'Classe not found' });
    return res.status(200).json(classe);
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST create class
router.post('/', async (req, res) => {
  const { nom, niveau, eleves, enseignant, code, subjects, room, schedule, capacity, effectif, moyenne, presenceRate, status } = req.body;

  if (!nom || !niveau) return res.status(400).json({ error: 'nom and niveau are required' });
  if (!ALLOWED_NIVEAUX.includes(niveau)) return res.status(400).json({ error: `niveau must be one of: ${ALLOWED_NIVEAUX.join(', ')}` });

  try {
    const newClasse = new Classe({
      nom,
      code,
      niveau,
      prof: typeof enseignant === 'string' && !mongoose.Types.ObjectId.isValid(enseignant) ? String(enseignant) : undefined,
      subjects: Array.isArray(subjects) ? subjects : (subjects ? [subjects] : []),
      room,
      schedule,
      eleves: Array.isArray(eleves) ? eleves : (eleves ? [eleves] : []),
      capacity: capacity ?? undefined,
      effectif: effectif ?? undefined,
      moyenne: moyenne ?? undefined,
      presenceRate: presenceRate ?? undefined,
      status: status ?? undefined,
      enseignant: mongoose.Types.ObjectId.isValid(enseignant) ? enseignant : undefined
    });

    await newClasse.save();

    if (newClasse.enseignant) {
      await Enseignant.findByIdAndUpdate(newClasse.enseignant, { $addToSet: { classes: newClasse._id } });
    }

    await newClasse.populate('eleves enseignant');
    return res.status(201).json(newClasse);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: 'Validation error', details: err.errors });
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PUT update class
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, niveau, eleves, enseignant, code, subjects, room, schedule, capacity, effectif, moyenne, presenceRate, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  if (niveau && !ALLOWED_NIVEAUX.includes(niveau)) return res.status(400).json({ error: `niveau must be one of: ${ALLOWED_NIVEAUX.join(', ')}` });

  try {
    const classe = await Classe.findById(id);
    if (!classe) return res.status(404).json({ error: 'Classe not found' });

    const prevEnseignantId = classe.enseignant ? String(classe.enseignant) : null;
    const newEnseignantId = mongoose.Types.ObjectId.isValid(enseignant) ? String(enseignant) : (enseignant ? null : null);

    if (nom !== undefined) classe.nom = nom;
    if (niveau !== undefined) classe.niveau = niveau;
    if (code !== undefined) classe.code = code;
    if (subjects !== undefined) classe.subjects = Array.isArray(subjects) ? subjects : (subjects ? [subjects] : []);
    if (room !== undefined) classe.room = room;
    if (schedule !== undefined) classe.schedule = schedule;
    if (eleves !== undefined) classe.eleves = Array.isArray(eleves) ? eleves : (eleves ? [eleves] : []);
    if (capacity !== undefined) classe.capacity = capacity;
    if (effectif !== undefined) classe.effectif = effectif;
    if (moyenne !== undefined) classe.moyenne = moyenne;
    if (presenceRate !== undefined) classe.presenceRate = presenceRate;
    if (status !== undefined) classe.status = status;

    classe.enseignant = newEnseignantId || undefined;

    await classe.save();

    if (prevEnseignantId && prevEnseignantId !== newEnseignantId) {
      await Enseignant.findByIdAndUpdate(prevEnseignantId, { $pull: { classes: classe._id } });
    }
    if (newEnseignantId && prevEnseignantId !== newEnseignantId) {
      await Enseignant.findByIdAndUpdate(newEnseignantId, { $addToSet: { classes: classe._id } });
    }

    await classe.populate('eleves enseignant');
    return res.status(200).json(classe);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: 'Validation error', details: err.errors });
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// DELETE class
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const classe = await Classe.findByIdAndDelete(id);
    if (!classe) return res.status(404).json({ error: 'Classe not found' });

    if (classe.enseignant) {
      await Enseignant.findByIdAndUpdate(classe.enseignant, { $pull: { classes: classe._id } });
    }

    return res.status(200).json({ message: 'Classe supprimée' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
