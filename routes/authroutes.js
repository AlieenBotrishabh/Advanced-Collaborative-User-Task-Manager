const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser, getActiveUsers, logoutUser } = require('../controller/authcontroller');
const authMiddleware = require('../middlewares/authmiddleware');

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);

// New routes
router.get('/active-users', authMiddleware, getActiveUsers);
router.post('/logout', authMiddleware, logoutUser);

module.exports = router;