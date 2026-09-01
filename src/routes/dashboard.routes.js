import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/stats', dashboardController.getDashboardStats);
router.get('/recent', dashboardController.getRecentActivities);

export default router;
