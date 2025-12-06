const express = require('express');
const router = express.Router();
const { createNutrition, listNutrition, updateNutrition, deleteNutrition } = require('../controllers/nutrition.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createNutrition);
router.get('/', protect, listNutrition);
router.put('/:id', protect, updateNutrition);
router.delete('/:id', protect, deleteNutrition);

module.exports = router;
