const { Joi, celebrate } = require('celebrate');

const regularEx = /^(http|https):\/\/(?:www\.)?[a-zA-Z0-9._~\-:?#[\]@!$&'()*+,/;=]{2,256}\.[a-zA-Z0-9./?#-]{2,}$/;

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regularEx),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation
};