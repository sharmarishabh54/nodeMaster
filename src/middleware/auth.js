const jwt = require('jsonwebtoken');
const { key } = require('../../config');
const User = require('../models/user.model')

const verifyToken = async (req, res, next,role) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send('A token is required for authorization');
    };

    try {
        const decode = jwt.verify(token, key);
        console.log('this is decode__', decode);
        req.user = decode;

        const checkUserType = await User.findOne({ user_email: req.user.email },{user_role:1}).lean();
        
        if(checkUserType.user_role === role){
            return next();
        }
        else if(role === "All"){
            return next();
        }
        else{
            return res.status(401).send("Access denied");  
        }

    } catch (error) {
        return res.status(401).send("Invalid Token");
    }
};

module.exports = verifyToken;