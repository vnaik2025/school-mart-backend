import express from 'express';
import uniformController from '../controllers/uniform.controller.js';
import { validate } from '../middleware/validator.js';
import * as uniformValidation from '../validations/uniform.validation.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

router.post('/', validate(uniformValidation.createVariantSchema), uniformController.createVariant);
router.put('/:id', validate(uniformValidation.updateVariantSchema), uniformController.updateVariant);
router.delete('/:id', uniformController.deleteVariant);

export default router;
