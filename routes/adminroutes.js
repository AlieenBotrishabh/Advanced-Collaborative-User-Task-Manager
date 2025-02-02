const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const adminMiddleware = require('../middlewares/adminmiddleware');

router.get('/', authMiddleware, adminMiddleware, (req, res) => {
    res.json({
        mag : 'Home Page'
    })
})

module.exports = router;