import express from 'express';
import deliveryController from '../controllers/delivery.controller.js';
import { validate } from '../middleware/validator.js';
import { createDeliverySchema, updateDeliverySchema, orderIdParamSchema } from '../validations/delivery.validation.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/:orderId', authorize('ADMIN'), validate({ params: orderIdParamSchema, body: createDeliverySchema }), deliveryController.createDelivery);
router.put('/:orderId', authorize('ADMIN'), validate({ params: orderIdParamSchema, body: updateDeliverySchema }), deliveryController.updateDeliveryStatus);
router.get('/:orderId', validate({ params: orderIdParamSchema }), deliveryController.getDeliveryDetails);

export default router;
