const Matiere = require("../models/Matiere");

async function lister(req, res, next) {
  try {
    const data = await Matiere.find().populate("enseignant").populate("classe");
    res.json(data);
  } catch (err) { next(err); }
}

async function creer(req, res, next) {
  try {
    const m = await Matiere.create(req.body);
    res.status(201).json(m);
  } catch (err) { next(err); }
}

module.exports = { lister, creer };
