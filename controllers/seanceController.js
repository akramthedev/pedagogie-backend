const Seance = require("../models/Seance");

async function lister(req, res, next) {
  try {
    const data = await Seance.find().populate("enseignant").populate("classe"); //.populate("matiere")
    res.json(data);
  } catch (err) { next(err); }
}

async function creer(req, res, next) {
  try {
    const s = await Seance.create(req.body);
    res.status(201).json(s);
  } catch (err) { next(err); }
}

module.exports = { lister, creer };
