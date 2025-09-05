const express = require('express');
const router = express.Router();
const {register, login, googleLogin, googleSignup} = require('../controllers/user.Controller');

// Standard authentication routes
router.post('/login', login);
router.post('/register', register);

// Google OAuth routes
router.post('/google-login', googleLogin);
router.post('/google-signup', googleSignup);

module.exports = router;
