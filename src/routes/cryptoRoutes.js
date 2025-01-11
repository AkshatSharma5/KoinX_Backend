const express = require('express');
const { getStats, getDeviation } = require('../controllers/cryptoController');

const router = express.Router();

// Route to get stats
router.get('/stats', getStats);

// Route to get deviation
router.get('/deviation', getDeviation);

module.exports = router;


