const Subcription = require('../models/subscription.model');
const mongo = require('../../libs/manager');
const Counter = require('../models/counter.model');
const User = require('../models/user.model');

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



const createSubscription = async (subscription_plan) => {
    console.log('data of create subscription ___  ', subscription_plan);

    try {
        const newSubscription = await Subcription.create({
            subscription_plan: subscription_plan
        })
        console.log('newSubscription__', newSubscription)
        return {
            isCreated: true,
            res: {
                subscription_Plan: newSubscription
            },
            status: true
        }
    }
    catch (error) {
        const err = error.message;
        console.log(err);
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
            message: err
        }
    }
}


const updateSubscription = async (id, toUpdate) => {
    console.log("ToUpdate", toUpdate)
    try {
        const update = await Subcription.updateOne({ s_id: id }, { $set: toUpdate });
        return {
            status: true,
            message: 'Your Subscription plan is updated.',
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
        console.log('id.....', id)
        const update = await Subcription.deleteOne({ s_id: id });
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
            status: true,
            res: data
        }
    }
    catch (err) {
        return {
            status: false,
            res: "Not found record"
        }
    }
}

module.exports = { allSubscription, updateSubscription, deleteSubscription, createSubscription, getUserAndSubscription };