const express = require('express');
const router = express.Router();
const {adminLogin} = require('../controllers/admin.Controller');

router.post('/login', adminLogin);

module.exports = router;