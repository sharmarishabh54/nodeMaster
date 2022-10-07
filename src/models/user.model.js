const mongoose = require('mongoose')
const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(mongoose);


const Schema = mongoose.Schema;

const userModel = new Schema(
    {
        userID: {
            type: Number,
            unique: true,
            require: true
        },
        user_password: {
            type: String,
            require: true
        },
        user_firstName: {
            type: String,
            require: true
        },
        user_lastName: {
            type: String,
            require: true
        },
        user_age: {
            type: Number,
            require: true
        },
        user_email: {
            type: String,
            unique: true,
            require: true

        },
        user_gender: {
            type: String,
            enum: ['Male', 'Female'],
            require: true
        },
        user_role: {
            type: String,
            enum: ['Admin', 'Moderator'],
            require: true
        },
        user_subscriptionId:{
            type:Number,
            default:0,
        },
        subscriptionPlan_active:{
            type:Date,
            default:null
        },
        subscriptionPlan_expire:{
            type:Date,
            default:null
        }
    }, {
    timestamps: true,
});

userModel.plugin(AutoIncrement, { inc_field: 'userID' });

module.exports = mongoose.model('User', userModel);