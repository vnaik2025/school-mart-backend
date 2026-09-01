import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import { validate } from '../middleware/validator.js';
import { simulatePaymentSchema, orderIdParamSchema } from '../validations/payment.validation.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/:orderId/simulate', validate({ params: orderIdParamSchema, body: simulatePaymentSchema }), paymentController.simulatePayment);
router.get('/:orderId', validate({ params: orderIdParamSchema }), paymentController.getPaymentDetails);

export default router;
