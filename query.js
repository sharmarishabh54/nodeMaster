const User = require('./models/user.model');
const Subscription = require('./models/subscription.model');
const mongo = require('./libs/manager');

mongo.connect();

const createUser = async () => {
    try {
        const res = await User.create(
            {
                user_firstName: 'Aman',
                user_lastName: '',
                user_age: 23,
                user_gender: 'Male'
    
        }
        );
        console.log('Resonse:', res);
    } catch (error) {
        
    }
}

// createUser()

const createSubscription = async () => {
    const uid = 3;
    try {
        const res = await Subscription.create(
            {
                userID: uid,
                class: "Dangerous",
                subscription_Plan: {
                    purchaged:true,
                    purchagedOn: new Date()
                },
    
        }
        );
        console.log('Resonse:', res);
    } catch (error) {
        let reason;
        console.log("Error___", error.message)
        const toLook = error.message;
        // let result = toLook.includes(isShikha)
        // if(result){
        //     reason = 'Email already exists'
        // }
        if(!result){
            result = toLook.includes(uid)
            if(result){
                reason = 'UserID already exists'
            }
        }
        console.log("result____", reason);

    }
}

createSubscription();


// const as = async () => {
//     const s = await User.find({}).lean();
//     console.log(s)
// }

// as()