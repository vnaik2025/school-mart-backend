import Joi from 'joi';

export const createSchoolSchema = {
  body: Joi.object({
    name: Joi.string().trim().max(255).required(),
    address: Joi.string().trim().required(),
    contact_number: Joi.string().trim().max(20).required(),
    email: Joi.string().email().max(255).allow('', null),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
    display_order: Joi.number().integer().min(0).default(0)
  })
};

export const listSchoolsSchema = {
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

export const updateSchoolSchema = {
  body: Joi.object({
    name: Joi.string().trim().max(255),
    address: Joi.string().trim(),
    contact_number: Joi.string().trim().max(20),
    email: Joi.string().email().max(255).allow('', null),
    status: Joi.string().valid('ACTIVE', 'INACTIVE'),
    display_order: Joi.number().integer().min(0)
  }).min(1)
};

export const updateSchoolStatusSchema = {
  body: Joi.object({
    status: Joi.string().valid('ACTIVE', 'INACTIVE').required()
  })
};
