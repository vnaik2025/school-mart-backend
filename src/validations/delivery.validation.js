import Joi from 'joi';

export const createDeliverySchema = Joi.object({
  courier_name: Joi.string().max(150).optional(),
  tracking_number: Joi.string().max(255).optional(),
  tracking_url: Joi.string().uri().max(1000).optional()
});

export const updateDeliverySchema = Joi.object({
  status: Joi.string().valid(
    'PREPARING',
    'PACKED',
    'DISPATCHED',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED'
  ).required(),
  courier_name: Joi.string().max(150).optional(),
  tracking_number: Joi.string().max(255).optional(),
  tracking_url: Joi.string().uri().max(1000).optional(),
  remarks: Joi.string().max(500).optional()
});

export const orderIdParamSchema = Joi.object({
  orderId: Joi.number().integer().required()
});
