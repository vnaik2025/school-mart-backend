import Joi from 'joi';

export const listAuditLogsSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().optional(),
  filters: Joi.object({
    entity: Joi.string().valid(
      'USER', 'CUSTOMER_PROFILE', 'ADDRESS', 'SCHOOL', 'CATEGORY',
      'UNIFORM', 'VARIANT', 'MEDIA', 'SCHOOL_MAPPING',
      'CART', 'CART_ITEM', 'ORDER', 'PAYMENT', 'DELIVERY'
    ).optional(),
    action: Joi.string().optional(),
    user_id: Joi.number().integer().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
  }).optional()
});
