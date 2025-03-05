const express = require('express');
const router = express.Router();
const lineController = require('../controllers/lineController');

// Route pour ajouter une nouvelle ligne
router.post('/addLine', lineController.addLine);

module.exports = router;