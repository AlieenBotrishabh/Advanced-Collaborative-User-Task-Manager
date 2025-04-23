const express = require('express');
const { registerUser, loginUser } = require('../controller/authcontroller');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const { getCurrentUser } = require('../controller/authcontroller'); 

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/active', authMiddleware, (req, res) => {
    res.status(200).json({ success: true });
});

module.exports = router;