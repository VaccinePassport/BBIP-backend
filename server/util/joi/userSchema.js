const Joi = require('joi');

const userSchema = {
    postJoinSchema: Joi.object({
        user_id: Joi.string().email().required(),
        phone: Joi.string().required(),
        name: Joi.string().required(),
        birth: Joi.string().required(),
        gender: Joi.string().required(),
    }),
    patchAuthSchema: Joi.object({
        code: Joi.string().length(6).required(),
    }),
};

module.exports = userSchema;
