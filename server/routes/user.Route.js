const express = require('express');
const router = express.Router();
const {register, login, deleteAccount, changePassword, logout} = require('../controllers/user.Controller');

// login
router.post('/login', login);

// register
router.post('/register', register);

// delete profile
router.delete('/delete-profile/:id', deleteAccount);

// change password
router.patch('/change-password/:id', changePassword);

// logout
router.get('/logout', logout);

module.exports = router;
