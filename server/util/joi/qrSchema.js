const Joi = require('joi');

const qrSchema = {
    postGroup: Joi.object({
        user_id_list: Joi.array().items(Joi.string().email()).required(),
        qr_password: Joi.string().allow('').optional(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
    }),
    patchPermission: Joi.object({
        group_no: Joi.number().integer().required(),
        permission: Joi.number().integer().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
    }),
};

module.exports = qrSchema;
