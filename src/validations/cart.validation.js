import Joi from 'joi';

export const addItemSchema = Joi.object({
  variant_id: Joi.number().integer().required(),
  school_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required()
});

export const updateItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).required()
});

export const itemIdParamSchema = Joi.object({
  id: Joi.number().integer().required()
});
