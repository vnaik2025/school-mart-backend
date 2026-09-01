import express from 'express';
import uniformImageController from '../controllers/uniform-image.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

router.post('/', upload.single('image'), uniformImageController.uploadUniformImage);
router.delete('/:id', uniformImageController.deleteUniformImage);
router.put('/:id/thumbnail', uniformImageController.setUniformThumbnail);

export default router;
