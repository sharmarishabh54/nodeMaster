const Joi = require('joi');

const create = Joi.object({
    subscription_plan: Joi.string().valid('Silver', 'Gold', 'Platinum')
});

module.exports = { create };