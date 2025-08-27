const express = require("express");
const router = express.Router();
const Presence = require("../models/Presence");
const Seance = require("../models/Seance");  
const mongoose = require("mongoose");
const { normalizeSegments, clampToSeance } = require("../utils/segments");






router.post("/check-in/:seanceId/:classe/:jour", async (req, res) => {
  const { seanceId, classe, jour } = req.params;
 

  const { presences } = req.body;

  if (!Array.isArray(presences)) {
    return res.status(400).json({ error: "presences must be array" });
  }
  if (!mongoose.Types.ObjectId.isValid(seanceId)) {
    return res.status(400).json({ error: "invalid seanceId" });
  }

  const seance = await Seance.findById(seanceId).lean();
  if (!seance) return res.status(404).json({ error: "seance not found" });



  try {
    const ops = presences.map(async (p) => {
      const eleveId = p.eleve;
      if (!mongoose.Types.ObjectId.isValid(eleveId)) {
        throw new Error(`invalid eleveId ${eleveId}`);
      }

      const normalized = normalizeSegments(p.segments || []);
      const clamped = clampToSeance(normalized, seance.debut, seance.fin);

      const existing = await Presence.findOne({
        seance: seanceId,
        eleve: eleveId,
        jour,
        classe
      }).exec();

      if (!existing) {
        return Presence.create({
          seance: seanceId,
          eleve: eleveId,
          segments: clamped,
          jour,
          classe
        });
      } else {
        const union = [...(existing.segments || []), ...clamped];
        const merged = normalizeSegments(union);
        existing.segments = merged;
        return existing.save();
      }
    });

    const settled = await Promise.allSettled(ops);
    const successes = settled.filter(s => s.status === "fulfilled").length;
    const failures = settled
      .filter(s => s.status === "rejected")
      .map(s => s.reason && s.reason.message ? s.reason.message : String(s.reason));

    res.json({ ok: true, successes, failures });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});






router.get("/:seanceId", async (req, res) => {
  const { seanceId } = req.params;

  if (!seanceId) return res.status(400).json({ ok: false, message: "SeanceId is required" });

  try {
 

    const presences = await Presence.find({ seance: seanceId }).lean();
 

    res.status(200).json(presences);
  } catch (err) {
    console.error("Error fetching presences:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});


 


module.exports = router;
