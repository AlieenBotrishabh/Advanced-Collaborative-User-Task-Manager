const isAdminUser = (req, res, next) => {
    console.log('User Info', req.userInfo);

    if(!req.userInfo)
    {
        res.status(400).json({
            msg : 'Access denied'
        })
    }
    next();
}

module.exports = isAdminUser;