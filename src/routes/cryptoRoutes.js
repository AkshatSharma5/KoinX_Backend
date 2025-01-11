const express = require("express");
const { getStats, getDeviation, showIntroPage } = require("../controllers/cryptoController");

const router = express.Router();

router.get("/stats", getStats);
router.get("/deviation", getDeviation);
router.get("/", showIntroPage);

module.exports = router;
