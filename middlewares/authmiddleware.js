const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;