const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const stopController = require('../controllers/stopController');
const { protect } = require('../middleware/authMiddleware');

// TODO : ajouter auth
router.post('/addCategory', protect, categoryController.addCategory);
router.get('/:id/lines', protect, categoryController.getCategoryLines);
router.get('/:id/lines/:lineId', protect, categoryController.getLineDetails);
router.get('/:id/lines/:lineId/stops', protect, categoryController.getLineStops);
router.post('/:id/lines/:lineId/stops', protect, stopController.addLineStop);
router.put('/:id/lines/:lineId', protect, categoryController.updateLine);
router.delete('/:id/lines/:lineId/stops/:stopId', protect, stopController.deleteLineStop);

module.exports = router;