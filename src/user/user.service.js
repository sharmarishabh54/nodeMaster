const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongo = require('../../libs/manager');
const User = require('../models/user.model');
const Counter = require('../models/counter.model');
const { find } = require('../models/user.model');
const { key } = require('../../config');
const Subscription = require('../models/subscription.model');

mongo.connect()

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
            user_role:role
        });
        console.log("Response:", res);
        return {isResolved: true, res: res}
    } catch (error) {
        let reason,res;
        const e = error.message
        const toLook = e.includes(email);
        console.log('toLook__',toLook)
        if(toLook){
            reason = 'Email already exists';
        }
        const sequence = await Counter.find({id: "userID"}, {seq: 1}).lean();
        const getSequence = await User.find().sort({userID: -1}).limit(1).lean();
        console.log('sequence__ ',sequence[0].seq,'getSequence',getSequence[0]);
        const value = sequence[0].seq - 1;

        if(sequence[0].seq >getSequence[0].userID ){
            res = await Counter.updateOne(
                {id: "userID"},
                {$set:{
                seq: value
            }
        })
    }
    console.log("RES + Value__:", res, value)
    return {isResolved: false, res: res, value:reason}
    }
}

const loginUser = async (email, password) => {
    console.log(email, password)
    const find = await User.find();
    const findUser = await User.findOne({user_email:email});
    // console.log("FindUser:__", findUser, "FindAll__", find);

    if(!findUser){
        console.log("User not found");
        return {
            message: "Could not find user with provided email",
            status: 400,
            res : findUser
        };
    };
    const isMatch = await bcrypt.compare(password, findUser.user_password);
    if(!isMatch){
        return{
            message: "Could not find user with provided password",
            status: 400
        }
    };


    const token = jwt.sign(
        {
            user_id: findUser.userID, email:findUser.user_email
        }, key, {
            expiresIn: "2h"
        }

        )

            return {authID: token};

}


const updateUser = async(user_id, subscriptionPlan)=>{
    try{
        console.log('user id and subscriptionPlan',user_id,subscriptionPlan);

        const userFind = await User.aggregate([
            {
                $match :{ userID: user_id}
            },
            {
                $project:{
                    userID:1,
                    user_firstName:1,
                    user_lastName:1,
                }
            }
        ])
        
        // console.log('user data',userFind);


        // get subscription enum values
        const sub = await Subscription.schema.path('subscription_Plan').enumValues
        console.log('subscription values', sub);

        const sub_value = sub.indexOf(subscriptionPlan);
        console.log("subscription index",sub_value)

        // iff subscription plan number is not exist
        if(sub_value === -1){
            return{
                status:false,
                res:'Not valid Subscription plan'
            }
        }
        

        const userAddSubcriptionPlan = await User.updateOne({userID:user_id},
          {$set : 
              {user_subscriptionId:sub_value+1}
          })   
          console.log("update",userAddSubcriptionPlan);

          return {
              status:true,
              message:"Now you have subscription Plan",
              userfind: userFind[0],
              subscription_Plan:subscriptionPlan
          }
        
    }
    catch(err){
        return {
            status: false,
            res: "Not found record"
        }
    }
}


module.exports = { registerUser, loginUser, updateUser}