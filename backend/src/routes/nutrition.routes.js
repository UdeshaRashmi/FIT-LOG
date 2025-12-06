const express = require('express');
const router = express.Router();
const { createNutrition, listNutrition } = require('../controllers/nutrition.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createNutrition);
router.get('/', protect, listNutrition);

module.exports = router;
