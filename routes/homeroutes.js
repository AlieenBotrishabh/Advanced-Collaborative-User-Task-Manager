const express = require('express');
const authMiddleware = require('../middlewares/authmiddleware');

const router = express.Router();

router.get('/welcome', authMiddleware, (req, res) => {
    const { empid, name, email, password } = req.userInfo;

    res.status(200).json({
        msg : 'Home Page',
        user : {
            _id : empid,
            name,
            email
        }
    })
})

module.exports = router;