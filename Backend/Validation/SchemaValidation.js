const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const registerSchema = {
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    dob: Joi.string().required(),
  };
  return Joi.validate(data, registerSchema);
};

const loginValidation = (data) => {
  const loginSchema = {
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(data, loginSchema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
