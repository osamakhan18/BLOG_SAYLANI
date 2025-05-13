// routes/authRoute.js
const express = require('express');
const router = express.Router();
const {register, login, logout} = require('../controller/auth');

// Remove this line as it's incorrectly placed here
// app.use(express.json())

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;