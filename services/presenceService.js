const Presence = require("../models/Presence");
const Classe = require("../models/Classe");
const Seance = require("../models/Seance");

function normaliserJour(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diffHeures(debut, fin) {
  if (!debut || !fin) return 0;
  const ms = new Date(fin) - new Date(debut);
  return Math.max(ms / (1000 * 60 * 60), 0);
}




/**
 * Check-in générique
 * - Primaire: enregistre présence du jour (par classe)
 * - Secondaire: enregistre présence de la séance
 */
async function checkIn({ eleveId, classeId, seanceId, dateEntree }) {
  const jour = normaliserJour(dateEntree || new Date());
  const classe = await Classe.findById(classeId);
  if (!classe) throw { status: 404, message: "Classe introuvable" };

  // Secondaire (seance obligatoire)
  if (classe.niveau === "secondaire") {
    if (!seanceId) throw { status: 400, message: "seanceId requis pour secondaire" };
    const seance = await Seance.findById(seanceId);
    if (!seance) throw { status: 404, message: "Séance introuvable" };

    // Crée ou met à jour (si déjà existant)
    const presence = await Presence.findOneAndUpdate(
      { eleve: eleveId, seance: seanceId, jour },
      { $setOnInsert: { eleve: eleveId, classe: classeId, seance: seanceId, matiere: seance.matiere, jour },
        $set: { statut: "present", entree: dateEntree || new Date() } },
      { upsert: true, new: true }
    );
    return presence;
  }

  // Primaire (journalier, pas de matière)
  const presence = await Presence.findOneAndUpdate(
    { eleve: eleveId, classe: classeId, jour },
    { $setOnInsert: { eleve: eleveId, classe: classeId, jour },
      $set: { statut: "present", entree: dateEntree || new Date() } },
    { upsert: true, new: true }
  );
  return presence;
}









/**
 * Check-out générique
 * - Calcule heuresPresence (diff entre entrée/sortie)
 * - Si sortie avant entrée → 0
 */
async function checkOut({ presenceId, dateSortie }) {
  const presence = await Presence.findById(presenceId);
  if (!presence) throw { status: 404, message: "Présence introuvable" };

  presence.sortie = dateSortie || new Date();
  presence.heuresPresence = diffHeures(presence.entree, presence.sortie);

  // Option: statut "sorti-tot" si < durée attendue (à toi d'ajouter une règle de seuil)
  await presence.save();
  return presence;
}

/**
 * Marquer absent (utile si défaut = présent)
 * - Primaire: journée entière marquée absent
 * - Secondaire: séance manquée
 */
async function marquerAbsent({ eleveId, classeId, seanceId, date }) {
  const jour = normaliserJour(date || new Date());
  const classe = await Classe.findById(classeId);
  if (!classe) throw { status: 404, message: "Classe introuvable" };

  if (classe.niveau === "secondaire") {
    if (!seanceId) throw { status: 400, message: "seanceId requis pour secondaire" };
    const p = await Presence.findOneAndUpdate(
      { eleve: eleveId, classe: classeId, seance: seanceId, jour },
      { $setOnInsert: { eleve: eleveId, classe: classeId, seance: seanceId, jour },
        $set: { statut: "absent", entree: null, sortie: null, heuresPresence: 0 } },
      { upsert: true, new: true }
    );
    return p;
  }

  // Primaire
  const p = await Presence.findOneAndUpdate(
    { eleve: eleveId, classe: classeId, jour },
    { $setOnInsert: { eleve: eleveId, classe: classeId, jour },
      $set: { statut: "absent", entree: null, sortie: null, heuresPresence: 0 } },
    { upsert: true, new: true }
  );
  return p;
}

/**
 * Rapport quotidien pour un élève
 * - Primaire: 1 enregistrement par jour
 * - Secondaire: somme des heures de toutes les séances du jour
 */
async function rapportQuotidienEleve({ eleveId, jourDate }) {
  const jour = normaliserJour(jourDate || new Date());
  const presences = await Presence.find({ eleve: eleveId, jour })
    .populate("classe")
    .populate({ path: "seance", populate: ["matiere", "enseignant"] });

  const totalHeures = presences.reduce((sum, p) => sum + (p.heuresPresence || 0), 0);

  return { jour, totalHeures, presences };
}

module.exports = {
  checkIn,
  checkOut,
  marquerAbsent,
  rapportQuotidienEleve
};
