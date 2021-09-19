const Joi = require('joi');

const vaccincationSchema = {
    postVaccine: Joi.object({
        date: Joi.string().required(),
        location: Joi.string().required(),
        vaccine_type: Joi.string().required(),
        vaccine_session: Joi.number().integer().required(),
    }),
    getVaccineByIdx: Joi.object({
        vaccineIndex: Joi.string().regex(/^VC\d/).required(),
    }),
};

module.exports = vaccincationSchema;
