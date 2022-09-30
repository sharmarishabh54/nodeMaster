const Subcription = require('../models/subscription.model');
const mongo = require('../../libs/manager');
const Counter = require('../models/counter.model');
const User = require('../models/user.model');
const mongoose = require('mongoose').Aggregate.exec;

mongo.connect();

const allSubscription = async () => {
    try {
        const list = await Subcription.find({}).lean();
        if (!list.length) {
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



const createSubscription = async (subscription_Plan, userId) => {
    console.log('data of create subscription ___  ', subscription_Plan, userId);

    try {
        const newSubscription = await Subcription.create({
            user_ID: userId,
            subscription_Plan: subscription_Plan
        })

        const userData = await User.findOne({ userID: userId },
            {
                userID: 1,
                user_firstName: 1,
                user_lastName: 1,
                user_email: 1
            }
        ).lean();


        console.log('newSubscription__', newSubscription, userData)
        return {
            isCreated: true,
            res: {
                user_Info: userData,
                subscription_Plan: newSubscription
            },
            status: true
        }
    }
    catch (error) {
        let reason;
        const err = error.message;
        const toLook = err.includes(userId);
        console.log('toLook', toLook);

        if (toLook) {
            reason = 'You have already subscription Plan';
        }

        const sequence = await Counter.find({ id: 's_id' }, { seq: 1 }).lean();
        const value = sequence[0].seq - 1;
        const res = await Counter.updateOne(
            { id: 's_id' },
            {
                $set: {
                    seq: value
                }
            });
        console.log(' subscription res ', res);

        return {
            isCreated: false,
            res: res,
            message: reason
        }

    }
}


const updateSubscription = async (id, toUpdate) => {
    console.log("ToUpdate", toUpdate)
    try {
        const update = await Subcription.updateOne({ s_id: id }, { $set: toUpdate });
        return {
            status: true,
            message:'Your Subscription plan is updated.',
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
        console.log('id.....',id)
        const update = await Subcription.deleteOne({s_id:id});
        console.log(update)
        return {
            status: true,
            res: 'Your subscription plan is deactivate'
        }
    } catch (error) {
        return {
            status: false,
            res: "Not found record"
        }
    }

}

// only moderator user accessing  own information

const getUserAndSubscription = async (id) => {
    try {
        const data = await User.aggregate([
            {
                $match: {
                    userID: id,
                },
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: 'userID',      
                    foreignField: 'user_ID',   
                    as: 'sub',            
                },
            },
            {
                $project: {
                    userID: 1,
                    user_firstName: 1,
                    'sub.user_ID': 1,
                    'sub.subscription_Plan': 1,
                },
            },
        ]);
        console.log('....................\n', data);
        return {
            status:true,
            res:data
        }
    }
    catch (err) {
        return {
            status: false,
            res: "Not found record"
        }
    }
}

module.exports = { allSubscription, updateSubscription, deleteSubscription, createSubscription, getUserAndSubscription }
