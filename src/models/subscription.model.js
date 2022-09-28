const mongoose = require('mongoose')

const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(mongoose);

const Schema = mongoose.Schema;

const subscriptionModel = new Schema(
    {
        s_id: {
            type: Number,
            require: true,
            unique:true
        },
        userID:{
            type:Number,
            require: true,
            unique: true
        },
        subscription_Plan:{
            type:String,
            enum:['Silver','Gold','Platinum'],
            require: true
        },
    },
    {
        timestamps: true,
    }
);
subscriptionModel.plugin(AutoIncrement, {inc_field:'s_id'});
module.exports = mongoose.model('Subscription', subscriptionModel);