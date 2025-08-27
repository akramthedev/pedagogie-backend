const Enseignant = require("../models/Enseignant");
const Classe = require("../models/Classe");
const Seance = require("../models/Seance");

async function lister(req, res, next) {
  try {
    const data = await Enseignant.find() 
    res.json(data);
  } catch (err) { next(err); }
}




async function creer(req, res, next) {
  try {
    const ens = await Enseignant.create(req.body);
    res.status(201).json(ens);
  } catch (err) { next(err); }
}








async function getSingleProfileWithClasses(req, res, next) {
  try {
    const { enseignantId } = req.params;

    const profile = await Enseignant.findOne({
      _id : enseignantId
    });

    const classes = await Classe.find({ enseignant: enseignantId })
      .populate("eleves") 
      .exec();

    res.status(200).json({ profile, classes });

  } catch (err) { next(err); }
}



 
async function getSeances(req, res, next) {
  try {
    const { enseignantId, classId } = req.params;

    const seances = await Seance.find({
      enseignant : enseignantId,
      classe : classId
    }).populate("classe");

    res.status(200).send(seances);

  } catch (err) { next(err); }
}



 

module.exports = { lister, creer, getSingleProfileWithClasses, getSeances };