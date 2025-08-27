const Classe = require("../models/Classe");

async function lister(req, res, next) {
  try {
    const data = await Classe.find().populate("eleves");
    res.json(data);
  } catch (err) { next(err); }
}

async function creer(req, res, next) {
  try {
    const c = await Classe.create(req.body);
    res.status(201).json(c);
  } catch (err) { next(err); }
}

module.exports = { lister, creer };
