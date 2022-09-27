const jwt = require('jsonwebtoken');
const { key } = require('../config');

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    console.log('Token:', req.headers)
    if(!token){
        return res.status(403).send('A token is required for authorization');
    };
    
    try {
        const decode = jwt.verify(token,key);
        console.log('this is decode__',decode);
            req.user = decode;
        
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }

    return next();
};

module.exports = verifyToken;