const User = require('../models/user.model')

const checkRole = async(req, res, next, role)=>{
    const email = req.user.email

    console.log('email, role', email, role);

    const checkAdmin = await User.findOne({user_email:email},{user_role:1}).lean();
    console.log('checkAdmin ',checkAdmin);

    if(checkAdmin.user_role === role){

        return next();
       
        // return { userId : checkAdmin.userID,  movetoNext:()=>{next()}}
    }
    else{
        return res.status(403).send({
            message: 'You do not have permission to do that.'
        });
    }
    
}

module.exports = checkRole;