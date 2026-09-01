import express from 'express';
import addressController from '../controllers/address.controller.js';
import { validate } from '../middleware/validator.js';
import * as addressValidation from '../validations/address.validation.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All address routes require authentication
router.use(authenticate);

router.post('/', validate(addressValidation.addressSchema), addressController.createAddress);
router.get('/', addressController.getAddresses);
router.put('/:id', validate(addressValidation.updateAddressSchema), addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

export default router;
