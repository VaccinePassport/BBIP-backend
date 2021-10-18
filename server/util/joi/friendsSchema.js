const Joi = require('joi');

const friendsSchema = {
    patchAccept: Joi.object({
        friend_id: Joi.string().email().required(),
        accept: Joi.number().integer().required(),
    }),
};

module.exports = friendsSchema;
