const express = require('express');
const router = express.Router();
const { createActivity, listActivities } = require('../controllers/activity.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createActivity);
router.get('/', protect, listActivities);

module.exports = router;
