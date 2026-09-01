import Joi from 'joi';

export const addressSchema = {
  body: Joi.object({
    full_name: Joi.string().trim().max(150).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
      'string.pattern.base': 'Phone number must contain between 10 and 15 digits'
    }),
    address_line_1: Joi.string().trim().max(255).required(),
    address_line_2: Joi.string().trim().max(255).allow('', null),
    landmark: Joi.string().trim().max(255).allow('', null),
    city: Joi.string().trim().max(100).required(),
    state: Joi.string().trim().max(100).required(),
    postal_code: Joi.string().trim().max(20).required(),
    country: Joi.string().trim().max(100).required(),
    is_default: Joi.boolean().default(false)
  })
};

export const updateAddressSchema = {
  body: Joi.object({
    full_name: Joi.string().trim().max(150),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).messages({
      'string.pattern.base': 'Phone number must contain between 10 and 15 digits'
    }),
    address_line_1: Joi.string().trim().max(255),
    address_line_2: Joi.string().trim().max(255).allow('', null),
    landmark: Joi.string().trim().max(255).allow('', null),
    city: Joi.string().trim().max(100),
    state: Joi.string().trim().max(100),
    postal_code: Joi.string().trim().max(20),
    country: Joi.string().trim().max(100),
    is_default: Joi.boolean()
  }).min(1)
};
