import Joi from 'joi';

export const createOrderSchema = Joi.object({
  address_id: Joi.number().integer().optional()
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid(
    'PENDING_PAYMENT',
    'CONFIRMED',
    'RECEIVED',
    'PREPARING_FOR_DISPATCH',
    'DISPATCHED',
    'DELIVERED',
    'CANCELLED'
  ).required()
});

export const orderIdParamSchema = Joi.object({
  id: Joi.number().integer().required()
});

export const listOrdersSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().optional(),
  status: Joi.string().valid(
    'DRAFT',
    'PENDING_PAYMENT',
    'CONFIRMED',
    'RECEIVED',
    'PREPARING_FOR_DISPATCH',
    'DISPATCHED',
    'DELIVERED',
    'CANCELLED'
  ).optional()
});
