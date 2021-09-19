const Joi = require('joi');

const userSchema = {
    postJoin: Joi.object({
        user_id: Joi.string().email().required(),
        phone: Joi.string().regex(/^[0-9]{3}-[0-9]{3,4}-[0-9]{4}$/).required(),
        name: Joi.string().required(),
        birth: Joi.string().required(),
        gender: Joi.string().required(),
    }),
    patchAuth: Joi.object({
        code: Joi.string().length(6).required(),
    }),
};

module.exports = userSchema;
