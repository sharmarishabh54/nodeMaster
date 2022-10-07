const mongoose = require('mongoose')

const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(mongoose);

const Schema = mongoose.Schema;


const subscriptionModel = new Schema(
    {
        s_id: {
            type: Number,
            unique: true
        },
        subscription_plan: {
            type: String,
            unique: true,
            require: true
        },
        plan_validity_days:{
            type:Number,
            require:true
        }
    }
);
subscriptionModel.plugin(AutoIncrement, { inc_field: 's_id' });
module.exports = mongoose.model('Subscription', subscriptionModel);