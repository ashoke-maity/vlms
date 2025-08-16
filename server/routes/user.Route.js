const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/user.Controller');

// login routers
router.post('/login', login);

// register routers
router.post('/register', register);

module.exports = router;