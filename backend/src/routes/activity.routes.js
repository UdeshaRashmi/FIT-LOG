const express = require('express');
const router = express.Router();
const { createActivity, listActivities, updateActivity, deleteActivity } = require('../controllers/activity.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createActivity);
router.get('/', protect, listActivities);
router.put('/:id', protect, updateActivity);
router.delete('/:id', protect, deleteActivity);

module.exports = router;
