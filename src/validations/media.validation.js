import Joi from 'joi';

export const uploadMediaSchema = {
  body: Joi.object({
    entity_type: Joi.string().valid('UNIFORM', 'SCHOOL', 'USER').required(),
    entity_id: Joi.number().integer().required()
  })
};

export const uploadUniformImageSchema = {
  body: Joi.object({
    uniform_id: Joi.number().integer().required()
  })
};
