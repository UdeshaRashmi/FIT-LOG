const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

module.exports = router;
