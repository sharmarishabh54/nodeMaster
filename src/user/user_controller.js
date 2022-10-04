const userService = require('./user.service');
const createPdf = require('../util/pdf')
const userValidation = require('./user.validation');

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


exports.update = async (req, res) => {
    try {
        const user_id = req.user.user_id
        const { subscription_plan } = req.body
        console.log('controller susplan', subscription_plan);
        await userValidation.update.validateAsync({ ...req.body });
        const response = await userService.updateUser(user_id, subscription_plan);


        if (response.status) {
            const { userID, user_firstName, user_lastName } = response.userfind;

            createPdf({
                pageTitle: 'Subscription Bill',
                userId: userID,
                firstName: user_firstName,
                lastName: user_lastName,
                subscription_Plan: response.subscription_Plan
            });
        }
        res.send(response);

    } catch (err) {
        console.log(err)
        res.send(err.message);
    }
}

exports.seeSubscription = async (req, res) => {
    try {
        const userId = req.user.user_id;
        console.log('userId', userId)
        const response = await userService.seeSubscription();
        return res.status(200).send(response.res)
    } catch (err) {
        console.log('error:', err.message);
        return res.send(err.message).status(404);
    }
}