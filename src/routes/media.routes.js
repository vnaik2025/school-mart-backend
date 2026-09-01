import express from 'express';
import mediaController from '../controllers/media.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

router.use(authenticate);

// Admin-only upload
router.post('/upload', authorize('ADMIN'), upload.single('image'), mediaController.uploadMedia);

export default router;
