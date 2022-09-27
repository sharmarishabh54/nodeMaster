const Subcription = require('../models/subscription.model');
const mongo = require('../../libs/manager');

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



const createSubscription = async(subscription_Plan, userId)=>{
    console.log('data of create subscription ___  ',subscription_Plan,userId);

    try{
        const newSubscription = await Subcription.create({
            userID:userId,
            subscription_Plan: subscription_Plan
        })

        console.log('newSubscription__',newSubscription)
        return{
            res: newSubscription,
            status: true
        }
    }
    catch(error){
        console.log(error.message)
        
    }
}


const updateSubscription = async (id, toUpdate) => {
    console.log("ToUpdate",toUpdate)
    try {
        const update = await Subcription.updateOne({s_id: id}, {$set:toUpdate});
        return {
            status: true,
            res: update
        }
    } catch (error) {
        return {
            status: false,
            res: "Not found record"
        }
    }

}

const deleteSubscription = async (id) => {
    try {
        const update = await Subcription.deleteOne({s_id: id});
        return {
            status: true,
            res: update
        }
    } catch (error) {
        return {
            status: false,
            res: "Not found record"
        }
    }

}

module.exports = { allSubscription, updateSubscription, deleteSubscription,createSubscription }