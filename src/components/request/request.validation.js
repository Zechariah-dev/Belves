const Joi = require('joi');

exports.updateRequestValidation = (payload) => {
    const schema = Joi.object({
        status: Joi.string().valid('Aceepted', 'Rejected').required()
    });

    return schema.validate(payload);
};

