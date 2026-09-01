import Joi from 'joi';

export const simulatePaymentSchema = Joi.object({
  outcome: Joi.string().valid('SUCCESS', 'FAILED').required()
});

export const orderIdParamSchema = Joi.object({
  orderId: Joi.number().integer().required()
});
