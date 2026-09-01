import express from 'express';
import orderController from '../controllers/order.controller.js';
import { validate } from '../middleware/validator.js';
import { createOrderSchema, updateStatusSchema, orderIdParamSchema, listOrdersSchema } from '../validations/order.validation.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validate({ body: createOrderSchema }), orderController.checkout);
router.post('/list', validate({ query: listOrdersSchema }), orderController.listOrders);
router.get('/:id', validate({ params: orderIdParamSchema }), orderController.getOrderDetails);
router.put('/:id/status', authorize('ADMIN'), validate({ params: orderIdParamSchema, body: updateStatusSchema }), orderController.updateOrderStatus);
router.delete('/:id', validate({ params: orderIdParamSchema }), orderController.cancelOrder);

export default router;
