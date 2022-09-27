const subscriptionService = require('./subscription.service');


exports.allSubscriptions = async (req, res) => {
    try {
        const response = await subscriptionService.allSubscription();
        return res.send(response.res);
    } catch (error) {
        console.log('error:',error.message)
    }
}

exports.updateSubscriptions = async (req, res) => {
    try {
        console.log("Request data:__", req.params.id, req.body);
        const response = await subscriptionService.updateSubscription(req.params.id, req.body);
        if(!response.status){
            res.send(response.res).status(404);
        }
        res.send(response.res).status(200);
    } catch (error) {
        console.log('error:',error.message);
        return res.send(error.message).status(404);
    }
}

exports.deleteSubscriptions = async (req, res) => {
    try {
        const response = await subscriptionService.deleteSubscription(req.params.id);
        if(!response.status){
            res.send(response.res).status(404);
        }
        res.send(response.res).status(200);
    } catch (error) {
        console.log('error:',error.message);
        return res.send(error.message).status(404);
    }
}