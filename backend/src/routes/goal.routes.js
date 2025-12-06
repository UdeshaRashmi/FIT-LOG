const express = require('express');
const router = express.Router();
const { createGoal, listGoals } = require('../controllers/goal.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createGoal);
router.get('/', protect, listGoals);

module.exports = router;
