const express = require('express');
const router = express.Router();
const { createSleep, listSleep } = require('../controllers/sleep.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createSleep);
router.get('/', protect, listSleep);

module.exports = router;
