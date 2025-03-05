const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');

router.get('/distance/stops/:stop1Id/:stop2Id', statController.getStopsDistance);
router.get('/distance/lines/:lineId', statController.getLineDistance);

module.exports = router;