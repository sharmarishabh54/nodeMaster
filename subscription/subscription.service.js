const Subcription = require('../models/subscription.model');
const mongo = require('../libs/manager');

mongo.connect();

const allSubscription = async () => {
   try {
    const list = await Subcription.find({}).lean();
    if(!list.length){
        return {
            res: 'Subcriptions are not started yet!!',
            status: false
        }
    };
    return {
        res: list,
        status: true
    }
   } catch (error) {
    console.log(error.message)
   }
}

module.exports = { allSubscription }