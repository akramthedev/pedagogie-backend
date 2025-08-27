import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  subDays,
  isSameDay,
} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";




// primaire   : 68add4e57faf2d64301bc7ec
// secondaire : 68add5217faf2d64301bc7ee



let TEACHER_ID = "68add5217faf2d64301bc7ee";




const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
 


function utcIsoToLocalWallClock(isoString) {
  const d = new Date(isoString);
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
    d.getUTCMilliseconds()
  );
}




function normalizeSegmentsClient(rawSegments = []) {
  const segs = rawSegments
    .map((s) => ({ debut: new Date(s.debut), fin: new Date(s.fin), statut: !!s.statut }))
    .filter((s) => !isNaN(s.debut) && !isNaN(s.fin) && s.debut < s.fin)
    .sort((a, b) => a.debut - b.debut);

  const merged = [];
  for (const s of segs) {
    const last = merged[merged.length - 1];
    if (!last) merged.push({ ...s });
    else {
      if (last.fin >= s.debut) {
        if (last.statut === s.statut) last.fin = new Date(Math.max(last.fin, s.fin));
        else {
          if (last.debut < s.debut) {
            last.fin = s.debut;
            merged.push({ ...s });
          } else merged.push({ ...s });
        }
      } else merged.push({ ...s });
    }
  }
  return merged.map((s) => ({ debut: s.debut.toISOString(), fin: s.fin.toISOString(), statut: !!s.statut }));
}







export default function App() {



  
  const [teacherNiveau, setTeacherNiveau] = useState(null);
  const [classes, setClasses] = useState([]);
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [presences, setPresences] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSeanceId, setSelectedSeanceId] = useState(null);
  const [popupSeance, setPopupSeance] = useState(null);
  const [loadingPresences, setLoadingPresences] = useState(false);


  function handleSelectEvent(event) {
    setPopupSeance(event);
    fetchPresencesForSeance(event.id);
  }


  const handlePrev = () => setCurrentDate((d) => subDays(d, 1));
  const handleNext = () => setCurrentDate((d) => addDays(d, 1));



  async function fetchClassesAndProfile() {
    try {
      const res = await axios.get(`http://localhost:3001/api/enseignants/classes/${TEACHER_ID}`);
      if (res.status === 200) {
        setTeacherNiveau(res.data.profile.type);
        setClasses(res.data.classes);
      } else setClasses([]);
    } catch (err) {
      setClasses([]);
      console.error("Erreur axios :", err);
    } finally {
      setLoading(false);
    }
  }




  async function fetchSeances() {
    if (!selectedClasse) {
      setSeances([]);
      setPresences({})
      return;
    };
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3001/api/enseignants/seances/${TEACHER_ID}/${selectedClasse}`);
      if (res.status === 200) {
        const events = res.data.map((s, index) => ({
          id: s._id,
          title: `Séance: ${index + 1}`,
          start: utcIsoToLocalWallClock(s.debut),
          end: utcIsoToLocalWallClock(s.fin),
          raw: s,
        }));
        setSeances(events);
      } else setSeances([]);
    } catch (err) {
      console.error("Erreur axios :", err);
      setSeances([]);
    } finally {
      setLoading(false);
    }
  }




  



  async function fetchPresencesForSeance(seanceId) {
  if (!seanceId) return;

  setLoadingPresences(true);
  try {
    const res = await axios.get(`http://localhost:3001/api/presences/${seanceId}`);
    if (res.status === 200) {
      const data = res.data; 
      const byEleve = {};

      data.forEach((p) => {
        const lastSegment = p.segments?.[p.segments.length - 1];
        byEleve[p.eleve] = lastSegment ? lastSegment.statut : false; 
      });

      setPresences((prev) => ({ ...prev, [seanceId]: byEleve }));
    } else {
      setPresences((prev) => ({ ...prev, [seanceId]: {} }));  
    }
  } catch (err) {
    console.error("Erreur fetchPresencesForSeance:", err);
    setPresences((prev) => ({ ...prev, [seanceId]: {} }));
  } finally {
    setLoadingPresences(false);
  }
}







  useEffect(() => {
    fetchClassesAndProfile();
  }, []);



  useEffect(() => {
    fetchSeances();
  }, [selectedClasse]);





useEffect(() => {
  if (seances && seances.length > 0) {
    const todays = seances.filter((s) => isSameDay(s.start, currentDate));
    const newSeanceId = todays[0]?.id || null;

    setSelectedSeanceId((prev) => {
      if (prev && todays.some((t) => t.id === prev)) return prev;
      return newSeanceId;
    });

    if (newSeanceId) {
      fetchPresencesForSeance(newSeanceId);
    }
  }
}, [seances, currentDate]);




  function resolveElevesForSeance(s) {
    if (!s) return [];
    const rawClasse = s.raw?.classe;
    let classeObj = null;
    if (!rawClasse) {
      const maybeId = s.raw?.classe || s.raw?.classeId;
      if (typeof maybeId === "string") classeObj = classes.find((c) => c._id === maybeId);
    } else if (typeof rawClasse === "string") classeObj = classes.find((c) => c._id === rawClasse);
    else classeObj = rawClasse;

    const elevesFromRaw =
      (classeObj && classeObj.eleves) ||
      (s.raw && s.raw.eleves) ||
      (s.raw && s.raw.classe && s.raw.classe.eleves) ||
      [];

    return elevesFromRaw
      .map((e) => {
        if (!e) return null;
        const id = typeof e === "string" ? e : e._id || e.id;
        let name = null;
        for (const c of classes) {
          const found = (c.eleves || []).find((ce) => (typeof ce === "string" ? ce : ce._id || ce.id) === id) || null;
          if (found && typeof found !== "string") {
            name = found.nom || found.name || found.prenom ? `${found.nom || ""} ${found.prenom || ""}`.trim() : null;
            break;
          }
        }
        return { id, name };
      })
      .filter(Boolean);
  }



  

useEffect(() => {
  if(seances && seances.length > 0){
    seances.forEach((s) => {
      const eleves = (s.raw?.classe?.eleves || s.raw?.eleves) || [];
      setPresences((prev) => {
        if (prev[s.id]) return prev; 

        const byEleve = {};
        eleves.forEach((e) => {
          const id = typeof e === "string" ? e : e._id || e.id;
          if (id) byEleve[id] = true;  
        });
        return { ...prev, [s.id]: byEleve };
      });
    });
  }
}, [seances, classes]);







  function togglePresenceForSeance(seanceId, eleveId) {
    setPresences((prev) => {
      const seanceMap = { ...(prev[seanceId] || {}) };
      seanceMap[eleveId] = !seanceMap[eleveId];
      return { ...prev, [seanceId]: seanceMap };
    });
  }







  

  async function savePresences(seanceId) {
  if (!seanceId) {
    alert("Aucune séance sélectionnée.");
    return;
  }
  const current = seances.find((s) => s.id === seanceId);
  if (!current) {
    alert("Séance introuvable.");
    return;
  }

  const mapForSeance = presences[seanceId] || {};
  const students = resolveElevesForSeance(current);

  // 🔥 Always include ALL students
  const payloadPresences = students.map((st) => {
    const statut = !!mapForSeance[st.id]; // default false if not present
    const segment = {
      debut: current.raw?.debut
        ? new Date(current.raw.debut).toISOString()
        : current.start.toISOString(),
      fin: current.raw?.fin
        ? new Date(current.raw.fin).toISOString()
        : current.end.toISOString(),
      statut,
    };
    const segments = normalizeSegmentsClient([segment]);
    return { eleve: st.id, segments };
  });

  let jour = current.raw.debut;

  try {
    const res = await axios.post(
      `http://localhost:3001/api/presences/check-in/${seanceId}/${selectedClasse}/${jour}`,
      { presences: payloadPresences }
    );
    if (res.status === 200 || res.status === 201) {
      alert(
        `Présences sauvegardées (${res.data.count ?? payloadPresences.length}).`
      );
    } else {
      alert("Réponse inattendue du serveur.");
      console.log(res);
    }
  } catch (err) {
    console.error("Erreur savePresences:", err);
    alert("Erreur lors de la sauvegarde.");
  }
}










  const todaysSeances = seances?.length
    ? seances.filter((s) => isSameDay(s.start, currentDate))
    : [];

  const currentSeance =
    (seances?.length && seances.find((s) => s.id === selectedSeanceId)) ||
    (todaysSeances.length > 0 ? todaysSeances[0] : null);


  const students = resolveElevesForSeance(currentSeance);

 
  if (loading) return <p>Chargement...</p>;





  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>



     
     {popupSeance && (
        <div style={styles.overlay} onClick={() => setPopupSeance(null)}>
          

          {
            loadingPresences ? 
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
              Chargement des présences... 
              <br />
              Veuillez patienter
            </div>
            :
            <>
            
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
              <h2>Absences des secondaire</h2>
              <p>{popupSeance.title}</p>
              <p>
                {format(new Date(popupSeance.raw.debut), "HH:mm")} - {format(new Date(popupSeance.raw.fin), "HH:mm")}
              </p>

              <div style={{ maxHeight: "300px", overflowY: "auto", textAlign: "left", marginTop: "10px" }}>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {resolveElevesForSeance(popupSeance).map((st) => {
                    const checked = !!(presences?.[popupSeance.id] || {})[st.id];
                    return (
                      <li key={st.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", borderBottom: "1px solid #eee" }}>
                        <div>
                          <div>{st.name || st.id}</div>
                          <div style={{ fontSize: 12, color: "#666" }}>{st.id}</div>
                        </div>
                        <div>
                          <label>
                            Présent{" "}
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePresenceForSeance(popupSeance.id, st.id)}
                            />
                          </label>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div style={{ marginTop: 12 }}>
                <button onClick={() => setPopupSeance(null)}>Fermer</button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={() => savePresences(popupSeance.id)}>Sauvegarder l'absence</button>
              </div>
            </div>

            </>
          }
        </div>
      )}




      <h2>Renseigner l'absence</h2>

      <div>
        <label>
          Classe:{" "}
          <select value={selectedClasse || ""} onChange={(e) => setSelectedClasse(e.target.value)}>
            <option value="">-- Choisir une classe --</option>
            {classes.map((classe) => (
              <option key={classe._id} value={classe._id}>
                {classe.nom}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Niveau :</strong> {teacherNiveau}
      </div>

       
      <br />

      <div>
        {teacherNiveau === "secondaire" ? (
          <Calendar
            localizer={localizer}
            events={seances}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            defaultView="week"
            views={["week", "day", "agenda"]}
            defaultDate={seances[0]?.start || new Date()}
            onSelectEvent={handleSelectEvent}  
          />
        ) : (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
              <button onClick={handlePrev}>{"< Prev"}</button>
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>{format(currentDate, "eeee, MMMM do yyyy")}</span>
              <button onClick={handleNext}>{"Next >"}</button>
            </div>

            <div style={{ marginTop: "20px" }}>
              {todaysSeances.length === 0 ? (
                <p>Aucune séance prévue pour cette date.</p>
              ) : (
                <>
                  {todaysSeances.length > 1 && (
                    <div style={{ marginBottom: 12 }}>
                      <label>
                        Séance:{" "}
                        <select value={selectedSeanceId || ""} onChange={(e) => setSelectedSeanceId(e.target.value)}>
                          {todaysSeances.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title} ({format(s.start, "HH:mm")} - {format(s.end, "HH:mm")})
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}

                  <div style={{ textAlign: "left", maxWidth: 420, margin: "0 auto" }}>
                    {students.length === 0 ? (
                      <p>Aucun élève trouvé pour cette séance.</p>
                    ) : (
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {students.map((st) => {
                          const checked = !!(presences?.[currentSeance?.id] || {})[st.id];
                          return (
                            <li key={st.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #eee" }}>
                              <div>
                                <div>{st.name || st.id}</div>
                                <div style={{ fontSize: 12, color: "#666" }}>{st.id}</div>
                              </div>
                              <div>
                                <label>
                                  Présent{" "}
                                  <input type="checkbox" checked={checked} onChange={() => togglePresenceForSeance(currentSeance.id, st.id)} />
                                </label>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <button onClick={() => savePresences(currentSeance.id)}>Sauvegarder présences</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  popup: {
    backgroundColor: "#fff",
    padding: "20px 30px",
    borderRadius: "12px",
    minWidth: "320px",
    maxWidth: "90%",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
};



