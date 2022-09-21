const userService = require('./user.service');

exports.register = async (req, res) => {
    try {
        const {firstName, lastName, email, age, gender, password } = req.body;
        const user = await userService.registerUser(firstName, lastName, email, age, gender, password);
        if(user.isResolved == true){
            res.send({
                message: 'User has created',
                status: 'completed'
            })
        }else{
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
        if(email !== "" && password !== ""){
            const response = await userService.loginUser(email, password);
            res.send(response).status(200)
        }else{
            res.send("Email and password can not be empty").status(401)
        }
    } catch (error) {
        console.log(error)
    }
}