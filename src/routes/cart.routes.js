import express from 'express';
import cartController from '../controllers/cart.controller.js';
import { validate } from '../middleware/validator.js';
import { addItemSchema, updateItemSchema, itemIdParamSchema } from '../validations/cart.validation.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All cart endpoints require customer authentication
router.use(authenticate);

router.get('/', cartController.getActiveCart);
router.post('/items', validate({ body: addItemSchema }), cartController.addItemToCart);
router.put('/items/:id', validate({ params: itemIdParamSchema, body: updateItemSchema }), cartController.updateItemQuantity);
router.delete('/items/:id', validate({ params: itemIdParamSchema }), cartController.removeItem);
router.delete('/', cartController.clearCart);

export default router;
