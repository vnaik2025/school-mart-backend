import Joi from 'joi';

export const registerSchema = {
  body: Joi.object({
    first_name: Joi.string().trim().max(100).required(),
    last_name: Joi.string().trim().max(100).required(),
    email: Joi.string().email().max(255).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
      'string.pattern.base': 'Phone number must contain between 10 and 15 digits'
    }),
    password: Joi.string().min(8).max(128).required()
  })
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

export const refreshTokenSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required()
  })
};

export const logoutSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required()
  })
};

export const forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required()
  })
};

export const resetPasswordSchema = {
  body: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required()
  })
};

export const changePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required()
  })
};
