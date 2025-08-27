const express = require("express");
const ctrl = require("../controllers/enseignantController");
const router = express.Router();




router.get("/", ctrl.lister);
router.get("/classes/:enseignantId", ctrl.getSingleProfileWithClasses);
router.get("/seances/:enseignantId/:classId", ctrl.getSeances);
router.post("/", ctrl.creer);





module.exports = router;