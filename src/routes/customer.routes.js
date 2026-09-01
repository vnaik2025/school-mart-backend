import express from 'express';
import customerController from '../controllers/customer.controller.js';
import { validate } from '../middleware/validator.js';
import * as customerValidation from '../validations/customer.validation.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

// Customer endpoints
router.get('/profile', authorize('CUSTOMER'), customerController.getProfile);
router.put('/profile', authorize('CUSTOMER'), validate(customerValidation.updateProfileSchema), customerController.updateProfile);

// Admin endpoints
router.post('/list', authorize('ADMIN'), validate(customerValidation.listCustomersSchema), customerController.listCustomers);
router.get('/:id', authorize('ADMIN'), customerController.getCustomerDetails);
router.put('/:id/status', authorize('ADMIN'), validate(customerValidation.updateStatusSchema), customerController.updateCustomerStatus);

export default router;
