const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongo = require('../../libs/manager');
const User = require('../models/user.model');
const Counter = require('../models/counter.model');
const { key } = require('../../config');
const Subscription = require('../models/subscription.model');
const sub_validity = require('../util/plan_validity');


mongo.connect();

const registerUser = async (firstName, lastName, email, age, gender, password, role) => {
    const payload = {
        firstname: firstName,
        lastName: lastName,
        email: email,
        age: age
    }
    console.log("Payload__", payload);
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;
    try {
        const res = await User.create({
            user_firstName: firstName,
            user_lastName: lastName,
            user_email: email,
            user_password: password,
            user_age: 23,
            user_gender: gender,
            user_role: role
        });
        return { isResolved: true, res: res }
    } catch (error) {
        let reason, res;
        const e = error.message
        const toLook = e.includes(email);
        if (toLook) {
            reason = 'Email already exists';
        }
        const sequence = await Counter.find({ id: "userID" }, { seq: 1 }).lean();
        const getSequence = await User.find().sort({ userID: -1 }).limit(1).lean();

        const value = sequence[0].seq - 1;

        if (sequence[0].seq > getSequence[0].userID) {
            res = await Counter.updateOne(
                { id: "userID" },
                {
                    $set: {
                        seq: value
                    }
                })
        }

        return { isResolved: false, res: res, value: reason }
    }
}

const loginUser = async (email, password) => {
    console.log(email, password)
    const find = await User.find();
    const findUser = await User.findOne({ user_email: email });

    if (!findUser) {
        console.log("User not found");
        return {
            message: "Could not find user with provided email",
            status: 400,
            res: findUser
        };
    };
    const isMatch = await bcrypt.compare(password, findUser.user_password);
    if (!isMatch) {
        return {
            message: "Could not find user with provided password",
            status: 400
        }
    };

    const token = jwt.sign(
        {
            user_id: findUser.userID, email: findUser.user_email
        }, key, {
        expiresIn: "2h"
    })
    return { authID: token };
}


const buySubscriptionPlan = async (user_id, subscriptionPlan) => {
    try {
        console.log('user id and subscriptionPlan', user_id, subscriptionPlan);
        const subData = await Subscription.findOne({ subscription_plan: subscriptionPlan });

        const planEndDate = await sub_validity(subData.plan_validity_days)

        const userFind = await User.aggregate([
            {
                $match: { userID: user_id }
            },
            {
                $project: {
                    userID: 1,
                    user_firstName: 1,
                    user_lastName: 1,
                }
            }
        ])

        const userAddSubcriptionPlan = await User.updateMany({ userID: user_id },
            {
                $set:
                {
                    user_subscriptionId: subData.s_id,
                    subscriptionPlan_active: new Date().toISOString(),
                    subscriptionPlan_expire: planEndDate
                }
            })

        return {
            status: true,
            message: "Now you have subscription Plan",
            userfind: userFind[0],
            subscription_Plan: subscriptionPlan,
            plan_expire: planEndDate
        }

    }
    catch (err) {
        return {
            status: false,
            res: "Not found record"
        }
    }
}


const updateUser = async (userId, data) => {
    try {
        const password = data.user_password;
        if (data.user_role) {
            return {
                message: 'You cannot change your role try again'
            }
        }
        if (password) {
            const hashpass = await bcrypt.hash(password, 10);
            data.user_password = hashpass;
        }
        const userDataUpdate = await User.updateMany({ userID: userId }, { $set: data  });
        
        return {
            status: true,
            message: "user info successfuly update"
        };
    }
    catch (err) {
        return {
            status: false,
            res: "Not found record"
        }
    }
}



const seeSubscription = async () => {
    try {
        const data = await User.aggregate([
            {
                $match: {
                    user_role: 'Moderator',
                },
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: 'user_subscriptionId',
                    foreignField: 's_id',
                    as: 'sub',
                },
            },
            {
                $project: {
                    userID: 1,
                    user_firstName: 1,
                    'sub.s_id': 1,
                    'sub.subscription_plan': 1,
                },
            },
        ]);

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
};


const moderatorPlan = async (userId) => {
    try {
        const currentdate = new Date();
        const data = await User.aggregate([
            {
                $match: {
                    userID: userId,
                }
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: 'user_subscriptionId',
                    foreignField: 's_id',
                    as: 'sub',
                },
            },
            {
                $project: {
                    userID: 1,
                    user_firstName: 1,
                    'sub.subscription_plan': 1,
                    subscriptionPlan_expire: 1,
                    subscriptionPlan_active: 1,
                }
            }
        ])

        const { user_firstName, subscriptionPlan_active, subscriptionPlan_expire, sub } = data[0];

        const diff = subscriptionPlan_expire.getTime() - currentdate.getTime()
        const leftDays = Math.round(diff / (1000 * 3600 * 24));

        if (diff > 0) {
            return {
                User_Name: user_firstName,
                Subscription_plan: sub[0].subscription_plan,
                Plan_Active_Date: subscriptionPlan_active,
                Plan_Expire_Date: subscriptionPlan_expire,
                Days_left: leftDays
            }
        }
        else {
            return {
                message: 'Your subscription plan is expired'
            }
        }

    }
    catch (err) {
        return {
            status: false,
            res: "Not found record"
        }
    }
}

const deleteUser =async(userid)=>{
    try{
        const deleteData =  await User.deleteOne({userID:userid}).lean();
        return {
            status:true,
            message:"User successfuly delete"
        }
    }catch(err){

    }
}




module.exports = { registerUser, loginUser, buySubscriptionPlan, updateUser, seeSubscription, moderatorPlan,deleteUser }