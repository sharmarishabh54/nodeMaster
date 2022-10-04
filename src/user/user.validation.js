const Joi = require('joi');

const update = Joi.object({
    subscription_plan: Joi.string().valid('Silver', 'Gold', 'Platinum')
});

module.exports = { update };