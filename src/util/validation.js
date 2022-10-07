const Joi = require('joi');

const planValidation = Joi.object({
    subscription_plan: Joi.string().valid('Silver', 'Gold', 'Platinum')
});

const userRole = Joi.object({
    user_role : Joi.string().valid('Admin,Moderator')
});

module.exports = { planValidation,userRole };