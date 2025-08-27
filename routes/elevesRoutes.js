const express = require("express");
const ctrl = require("../controllers/eleveController");
const router = express.Router();

router.get("/", ctrl.lister);
router.post("/", ctrl.creer);

module.exports = router;
