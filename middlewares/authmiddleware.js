const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.log('auth middlewares is called');

    const authHeader = req.headers['authorization'];
    console.log(authHeader);

    const token = authHeader && authHeader.split(' ')[1];

    if(!token)
    {
        res.status(400).json({
            msg : 'Access denied No token provided'
        })
    }
    next();

    try
    {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedTokenInfo);

        req.userInfo = decodedTokenInfo;
        next();
    }
    catch(err)
    {
        res.status(400).json({
            msg : 'Access denied No token provided'
        })
    }
}

module.exports = authMiddleware;