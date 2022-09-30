const subscriptionService = require('./subscription.service');

const createPdf =  require('../util/pdf')



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
        const userId = req.user.user_id
        const { subscription_Plan } = req.body
        const response = await subscriptionService.createSubscription(subscription_Plan, userId);
        if (response.isCreated) {

            const { user_Info, subscription_Plan } = response.res;

            createPdf({
                pageTitle: 'Subscription Bill',
                firstName: user_Info.user_firstName,
                lastName: user_Info.user_lastName,
                subscription_Plan: subscription_Plan.subscription_Plan
            })

            return res.status(200).send({
                message :"Welcome to Prime",
                data:response.res
             })
    
        }
        else {
            return res.send({
                message: response.message
            })
        }
    }
    catch (error) {
        console.log('error:', error.message);
    }
}

exports.updateSubscriptions = async (req, res) => {
    try {
        const {id} = req.params
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
        const {id} =req.params

        const response = await subscriptionService.deleteSubscription(id);
        console.log('responce__',response)
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