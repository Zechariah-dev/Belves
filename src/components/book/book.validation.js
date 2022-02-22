const Joi = require('joi');

exports.createBookValidation = (payload) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    institution: Joi.string().required(),
    faculty: Joi.string().required(),
  });

  return schema.validate(payload);
};

exports.updateBookValidation = (payload) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    institution: Joi.string().required(),
    faculty: Joi.string().required(),
  });

  return schema.validate(payload);
};
