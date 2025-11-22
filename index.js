const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connecterDB = require("./config/db");
const routesEleves = require("./routes/elevesRoutes");
const routesEnseignants = require("./routes/enseignantsRoutes");
const routesClasses = require("./routes/classesRoutes");
const routesSeances = require("./routes/seancesRoutes");
const routesPresences = require("./routes/presencesRoutes");
const routesRetards = require("./routes/retardsRoutes");
const erreurMiddleware = require("./middlewares/erreurMiddleware");
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes");
const moduleRoutes = require("./routes/moduleRoutes")
const disciplineRoute = require('./routes/disciplineRoute');
const periodeRoutes = require("./routes/periodeRoutes")
const evalRoutes = require("./routes/evalRoutes")


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/eleves", routesEleves);
app.use("/api/classes", routesClasses);
app.use("/api/seances", routesSeances);
app.use("/api/presences", routesPresences);
app.use("/api/retards", routesRetards);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/modules", moduleRoutes);
app.use('/api/discipline', disciplineRoute);
app.use("/api/periode", periodeRoutes);
app.use('/api/evaluations', evalRoutes);
app.use("/api/enseignants", routesEnseignants);




app.use(erreurMiddleware);

const PORT = 3001

connecterDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});