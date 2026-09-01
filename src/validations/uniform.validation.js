import Joi from 'joi';

export const createUniformSchema = {
  body: Joi.object({
    category_id: Joi.number().integer().required(),
    sku: Joi.string().trim().max(100).required(),
    name: Joi.string().trim().max(255).required(),
    description: Joi.string().trim().allow('', null),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
    display_order: Joi.number().integer().min(0).default(0),
    school_ids: Joi.array().items(Joi.number().integer()).allow(null)
  })
};

export const listUniformsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().allow(''),
    category_id: Joi.number().integer(),
    school_id: Joi.number().integer(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'UNISEX'),
    status: Joi.string().valid('ACTIVE', 'INACTIVE')
  }),
  body: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    search: Joi.string().trim().allow(''),
    category_id: Joi.number().integer(),
    school_id: Joi.number().integer(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'UNISEX'),
    status: Joi.string().valid('ACTIVE', 'INACTIVE')
  })
};

export const updateUniformSchema = {
  body: Joi.object({
    category_id: Joi.number().integer(),
    sku: Joi.string().trim().max(100),
    name: Joi.string().trim().max(255),
    description: Joi.string().trim().allow('', null),
    status: Joi.string().valid('ACTIVE', 'INACTIVE'),
    display_order: Joi.number().integer().min(0),
    school_ids: Joi.array().items(Joi.number().integer())
  }).min(1)
};

export const createVariantSchema = {
  body: Joi.object({
    uniform_id: Joi.number().integer().required(),
    size: Joi.string().trim().max(30).required(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'UNISEX').default('UNISEX'),
    price: Joi.number().precision(2).positive().required(),
    quantity_requirement: Joi.number().integer().min(1).default(1),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
    display_order: Joi.number().integer().min(0).default(0)
  })
};

export const updateVariantSchema = {
  body: Joi.object({
    size: Joi.string().trim().max(30),
    gender: Joi.string().valid('MALE', 'FEMALE', 'UNISEX'),
    price: Joi.number().precision(2).positive(),
    quantity_requirement: Joi.number().integer().min(1),
    status: Joi.string().valid('ACTIVE', 'INACTIVE'),
    display_order: Joi.number().integer().min(0)
  }).min(1)
};
