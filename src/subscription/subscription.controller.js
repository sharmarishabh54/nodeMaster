const subscriptionService = require('./subscription.service');
const subscriptionValidation = require('./subscription.validation');

exports.allSubscriptions = async (req, res) => {
    try {
        const response = await subscriptionService.allSubscription();
        return res.send(response.res);
    } catch (error) {
        console.log('error:', error.message)
    }
}

exports.createSubscriptions = async (req, res) => {
    try {
        const { subscription_plan } = req.body
        await subscriptionValidation.create.validateAsync({ ...req.body });
        const response = await subscriptionService.createSubscription(subscription_plan);
        if (response.isCreated) {
            return res.status(200).send({
                message: "Welcome to Prime",
                data: response.res
            })
        }
        else {
            return res.send({
                message: response.message
            })
        }
    }
    catch (error) {
        res.send({ message: error.message });
    }
}

exports.updateSubscriptions = async (req, res) => {
    try {
        const { id } = req.params
        console.log("Request data:__", req.params.id, req.body);
        const response = await subscriptionService.updateSubscription(id, req.body);
        if (!response.status) {
            res.send(response.res).status(404);
        }
        res.send(response).status(200);

    } catch (error) {
        console.log('error:', error.message);
        return res.send(error.message).status(404);
    }
}

exports.deleteSubscriptions = async (req, res) => {
    try {
        const { id } = req.params

        const response = await subscriptionService.deleteSubscription(id);
        console.log('responce__', response)
        if (!response.status) {
            res.send(response.res).status(404);
        }
        res.send(response.res).status(200);
    } catch (error) {
        console.log('error:', error.message);
        return res.send(error.message).status(404);
    }
}

exports.getUserAndSubscriptions = async (req, res) => {
    try {
        const userId = req.user.user_id;
        console.log('userId', userId)
        const response = await subscriptionService.getUserAndSubscription(userId);
        return res.status(200).send(response.res)

    }
    catch (error) {
        console.log('error:', error.message);
        return res.send(error.message).status(404);
    }
}