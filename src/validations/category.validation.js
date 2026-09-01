import Joi from 'joi';

export const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().trim().max(100).required(),
    description: Joi.string().trim().allow('', null),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
    display_order: Joi.number().integer().min(0).default(0)
  })
};

export const listCategoriesSchema = {
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

export const updateCategorySchema = {
  body: Joi.object({
    name: Joi.string().trim().max(100),
    description: Joi.string().trim().allow('', null),
    status: Joi.string().valid('ACTIVE', 'INACTIVE'),
    display_order: Joi.number().integer().min(0)
  }).min(1)
};
