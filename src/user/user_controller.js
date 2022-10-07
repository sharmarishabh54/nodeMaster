const userService = require('./user.service');
const createPdf = require('../util/pdf')
const {planValidation} = require('../util/validation');

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, age, gender, password, role } = req.body;
        const user = await userService.registerUser(firstName, lastName, email, age, gender, password, role);
        if (user.isResolved == true) {
            res.send({
                message: 'User has created',
                status: 'completed'
            })
        } else {
            res.send({
                message: 'Could not create user',
                status: user.res,
                response: user.value
            })
        }
    } catch (error) {
        console.log(error.message)
    }

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email !== "" && password !== "") {
            const response = await userService.loginUser(email, password);
            res.send(response).status(200)
        } else {
            res.send("Email and password can not be empty").status(401)
        }
    } catch (error) {
        console.log(error)
    }
}


exports.buySubscription = async (req, res) => {
    try {
        const user_id = req.user.user_id
        const { subscription_plan } = req.body
        await planValidation.validateAsync({ ...req.body });
        const response = await userService.buySubscriptionPlan(user_id, subscription_plan);


        if (response.status) {
            const { userID, user_firstName, user_lastName } = response.userfind;
       

            createPdf({
                pageTitle: 'Subscription Bill',
                userId: userID,
                firstName: user_firstName,
                lastName: user_lastName,
                subscription_Plan: response.subscription_Plan,
                plan_expire_on:response.plan_expire,
            });
        }
        res.send(response);

    } catch (err) {
        console.log(err)
        res.send(err.message);
    }
}


exports.update = async(req,res)=>{
     try{
        const userId = req.user.user_id;
        const updateInfo = await userService.updateUser(userId,req.body);
        console.log(updateInfo);
        res.send(updateInfo);
     }
     catch(err){
        console.log(err)
        res.send(err.message);
     }
}

exports.seeSubscription = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const response = await userService.seeSubscription();
        return res.status(200).send(response.res)
    } catch (err) {
        console.log('error:', err.message);
        return res.send(err.message).status(404);
    }
}


exports.moderatorUser = async(req,res)=>{
    try {
        const userId = req.user.user_id;
        const response = await userService.moderatorPlan(userId);
        return res.status(200).send(response)
    } catch (err) {
        console.log('error:', err.message);
        return res.send(err.message).status(404);
    }
}


exports.isSubscribed = async(req,res,next)=>{
    try {
        const userId = req.user.user_id;
        const response = await userService.moderatorPlan(userId);

        if(response.Days_left >= 0){
            return next();
        }
        else{
            return res.send({
                message:"your plan is expired"
            })
        }

    } catch (err) {
        console.log('error:', err.message);
        return res.send(err.message).status(404);
    }
}


exports.deleteUser = async(req,res)=>{
    try{
        const userId = req.user.user_id;
        const response=  await  userService.deleteUser(userId);
        res.send(response);
    }catch(err){
        console.log('error:', err.message);
        return res.send(err.message).status(404);
    }
}