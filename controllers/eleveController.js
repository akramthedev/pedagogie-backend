const Eleve = require("../models/Eleve");

async function lister(req, res, next) {
  try {
    const data = await Eleve.find().populate("classe");
    res.json(data);
  } catch (err) { next(err); }
}

async function creer(req, res, next) {
  try {
    const eleve = await Eleve.create(req.body);
    res.status(201).json(eleve);
  } catch (err) { next(err); }
}

module.exports = { lister, creer };
