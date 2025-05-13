const express = require('express');
const router = express.Router();

const verifyToken = require('../verifyToken');
const { getProfile,updateProfile } = require('../controller/userController');

// Profile route with token verification
router.get('/profile', verifyToken, getProfile);
router.put('/update',verifyToken,updateProfile)

module.exports = router;
