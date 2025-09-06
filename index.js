const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connecterDB = require("./config/db");
const routesEleves = require("./routes/elevesRoutes");
const routesEnseignants = require("./routes/enseignantsRoutes");
const routesClasses = require("./routes/classesRoutes");
const routesMatieres = require("./routes/matieresRoutes");
const routesSeances = require("./routes/seancesRoutes");
const routesPresences = require("./routes/presencesRoutes");
const routesRetards = require("./routes/retardsRoutes");
const routesCommentaires = require("./routes/commentairesRoutes");
const erreurMiddleware = require("./middlewares/erreurMiddleware");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/eleves", routesEleves);
app.use("/api/enseignants", routesEnseignants);
app.use("/api/classes", routesClasses);
app.use("/api/matieres", routesMatieres);
app.use("/api/seances", routesSeances);
app.use("/api/presences", routesPresences);
app.use("/api/retards", routesRetards);
app.use("/api/commentaires", routesCommentaires);

app.use(erreurMiddleware);

const PORT = process.env.PORT || 3001;

connecterDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
