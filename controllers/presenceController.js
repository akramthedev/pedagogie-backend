const presenceService = require("../services/presenceService");

async function postCheckIn(req, res, next) {
  try {
    const { eleveId, classeId, seanceId, entree } = req.body;
    const presence = await presenceService.checkIn({
      eleveId,
      classeId,
      seanceId,
      dateEntree: entree ? new Date(entree) : new Date()
    });
    res.status(201).json(presence);
  } catch (err) { next(err); }
}

async function postCheckOut(req, res, next) {
  try {
    const { presenceId, sortie } = req.body;
    const presence = await presenceService.checkOut({
      presenceId,
      dateSortie: sortie ? new Date(sortie) : new Date()
    });
    res.json(presence);
  } catch (err) { next(err); }
}

async function postAbsent(req, res, next) {
  try {
    const { eleveId, classeId, seanceId, date } = req.body;
    const presence = await presenceService.marquerAbsent({
      eleveId, classeId, seanceId, date
    });
    res.status(201).json(presence);
  } catch (err) { next(err); }
}

async function getRapportQuotidien(req, res, next) {
  try {
    const { eleveId } = req.params;
    const { jour } = req.query;
    const data = await presenceService.rapportQuotidienEleve({
      eleveId,
      jourDate: jour ? new Date(jour) : new Date()
    });
    res.json(data);
  } catch (err) { next(err); }
}

module.exports = {
  postCheckIn,
  postCheckOut,
  postAbsent,
  getRapportQuotidien
};
