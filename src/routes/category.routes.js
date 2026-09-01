import express from 'express';
import categoryController from '../controllers/category.controller.js';
import { validate } from '../middleware/validator.js';
import * as categoryValidation from '../validations/category.validation.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

// Authenticated routes
router.post('/list', validate(categoryValidation.listCategoriesSchema), categoryController.listCategories);
router.get('/:id', categoryController.getCategory);

// Admin-only routes
router.post('/', authorize('ADMIN'), validate(categoryValidation.createCategorySchema), categoryController.createCategory);
router.put('/:id', authorize('ADMIN'), validate(categoryValidation.updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', authorize('ADMIN'), categoryController.deleteCategory);

export default router;
