const express = require('express');
const router = express.Router();
const {register, login, deleteAccount, changePassword, logout, addToFavorites, removeFromFavorites, getFavorites} = require('../controllers/user.Controller');
const { verifyToken } = require('../middlewares/auth');

// login
router.post('/login', login);

// register
router.post('/register', register);

// delete profile
router.delete('/delete-profile/:id', verifyToken, deleteAccount);

// change password
router.put('/change-password/:id', verifyToken, changePassword);

// logout
router.get('/logout', verifyToken, logout);

// Favorites routes
router.post('/favorites', verifyToken, addToFavorites);
router.delete('/favorites/:userId/:videoId', verifyToken, removeFromFavorites);
router.get('/favorites/:userId', verifyToken, getFavorites);

module.exports = router;
