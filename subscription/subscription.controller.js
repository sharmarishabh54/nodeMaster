const subscriptionService = require('./subscription.service');


exports.allSubscriptions = async (req, res) => {
    try {
        const response = await subscriptionService.allSubscription();
        return res.send(response.res);
    } catch (error) {
        console.log('error:',error.message)
    }
}