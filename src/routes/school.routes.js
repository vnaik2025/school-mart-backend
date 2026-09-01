import express from 'express';
import schoolController from '../controllers/school.controller.js';
import { validate } from '../middleware/validator.js';
import * as schoolValidation from '../validations/school.validation.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

// Public (authenticated) routes
router.post('/list', validate(schoolValidation.listSchoolsSchema), schoolController.listSchools);
router.get('/:id', schoolController.getSchoolDetails);

// Admin-only routes
router.post('/', authorize('ADMIN'), validate(schoolValidation.createSchoolSchema), schoolController.createSchool);
router.put('/:id', authorize('ADMIN'), validate(schoolValidation.updateSchoolSchema), schoolController.updateSchool);
router.delete('/:id', authorize('ADMIN'), schoolController.deleteSchool);
router.put('/:id/status', authorize('ADMIN'), validate(schoolValidation.updateSchoolStatusSchema), schoolController.updateSchoolStatus);

export default router;
