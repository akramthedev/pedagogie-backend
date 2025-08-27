// utils/segments.js
function normalizeSegments(rawSegments = []) {
  const segs = rawSegments
    .map(s => ({ debut: new Date(s.debut), fin: new Date(s.fin), statut: !!s.statut }))
    .filter(s => !isNaN(s.debut) && !isNaN(s.fin) && s.debut < s.fin)
    .sort((a, b) => a.debut - b.debut);

  const merged = [];
  for (const s of segs) {
    const last = merged[merged.length - 1];
    if (!last) merged.push({ ...s });
    else {
      if (last.fin >= s.debut) {
        if (last.statut === s.statut) {
          last.fin = new Date(Math.max(last.fin, s.fin));
        } else {
          if (last.debut < s.debut) {
            last.fin = s.debut;
            merged.push({ ...s });
          } else {
            merged.push({ ...s });
          }
        }
      } else merged.push({ ...s });
    }
  }

  return merged.map(s => ({
    debut: s.debut.toISOString(),
    fin: s.fin.toISOString(),
    statut: !!s.statut
  }));
}

function clampToSeance(segments = [], seanceStart, seanceEnd) {
  const sStart = new Date(seanceStart);
  const sEnd = new Date(seanceEnd);
  return (segments || [])
    .map(s => ({
      debut: new Date(Math.max(new Date(s.debut).getTime(), sStart.getTime())),
      fin: new Date(Math.min(new Date(s.fin).getTime(), sEnd.getTime())),
      statut: !!s.statut
    }))
    .filter(s => s.debut < s.fin)
    .map(s => ({ debut: s.debut.toISOString(), fin: s.fin.toISOString(), statut: s.statut }));
}

module.exports = { normalizeSegments, clampToSeance };
