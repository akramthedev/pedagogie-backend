const express = require("express");
const ctrl = require("../controllers/classeController");
const router = express.Router();

router.get("/", ctrl.lister);
router.post("/", ctrl.creer);

module.exports = router;
