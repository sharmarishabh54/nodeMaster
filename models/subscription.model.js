const mongoose = require('mongoose')

const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(mongoose);

const Schema = mongoose.Schema;

const subscriptionModel = new Schema(
    {
        s_id: {
            type: Number,
            require: true
        },
        userID:{
            type:Number,
            require: true,
            unique: true
        },
        class:{
            type:String,
            require: true,
        },
        subscription_Plan:{
            type: Object,
            require: true
        },
    },
    {
        timestamps: true,
    }
);
subscriptionModel.plugin(AutoIncrement, {inc_field: 's_id'});
module.exports = mongoose.model('Subscription', subscriptionModel);