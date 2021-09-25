const Joi = require('joi');

const userSchema = {
    postAuth: Joi.object({
        email: Joi.string().email().required()
    }),
    postAuthConfirm: Joi.object({
        email: Joi.string().email().required(),
        code: Joi.string().length(6).required(),
    }),
    putJoin: Joi.object({
        user_id: Joi.string().email().required(),
        phone: Joi.string().regex(/^[0-9]{3}-[0-9]{3,4}-[0-9]{4}$/).required(),
        name: Joi.string().required(),
        birth: Joi.string().required(),
        gender: Joi.required()
    })
};

module.exports = userSchema;
