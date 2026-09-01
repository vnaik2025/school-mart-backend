import Joi from 'joi';

export const updateProfileSchema = {
  body: Joi.object({
    first_name: Joi.string().trim().max(100),
    last_name: Joi.string().trim().max(100)
  }).min(1)
};

export const listCustomersSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().allow(''),
    status: Joi.string().valid('ACTIVE', 'INACTIVE')
  }),
  body: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    search: Joi.string().trim().allow(''),
    status: Joi.string().valid('ACTIVE', 'INACTIVE')
  })
};

export const updateStatusSchema = {
  body: Joi.object({
    status: Joi.string().valid('ACTIVE', 'INACTIVE').required()
  })
};
