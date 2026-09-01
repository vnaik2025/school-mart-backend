import express from 'express';
import uniformController from '../controllers/uniform.controller.js';
import { validate } from '../middleware/validator.js';
import * as uniformValidation from '../validations/uniform.validation.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

// --- Uniform routes ---

// Authenticated (both ADMIN and CUSTOMER)
router.post('/list', validate(uniformValidation.listUniformsSchema), uniformController.listUniforms);
router.get('/:id', uniformController.getUniformDetails);

// Admin-only
router.post('/', authorize('ADMIN'), validate(uniformValidation.createUniformSchema), uniformController.createUniform);
router.put('/:id', authorize('ADMIN'), validate(uniformValidation.updateUniformSchema), uniformController.updateUniform);
router.delete('/:id', authorize('ADMIN'), uniformController.deleteUniform);

export default router;
