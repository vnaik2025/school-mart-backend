import express from 'express';
import healthRouter from './health.js';

import authRouter from './auth.routes.js';
import customerRouter from './customer.routes.js';
import addressRouter from './address.routes.js';
import schoolRouter from './school.routes.js';
import categoryRouter from './category.routes.js';
import uniformRouter from './uniform.routes.js';
import uniformVariantRouter from './uniform-variant.routes.js';
import mediaRouter from './media.routes.js';
import uniformImagesRouter from './uniform-images.routes.js';
import cartRouter from './cart.routes.js';
import orderRouter from './order.routes.js';
import paymentRouter from './payment.routes.js';
import deliveryRouter from './delivery.routes.js';
import auditRouter from './audit.routes.js';
import dashboardRouter from './dashboard.routes.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/customers', customerRouter);
router.use('/addresses', addressRouter);
router.use('/schools', schoolRouter);
router.use('/categories', categoryRouter);
router.use('/uniforms', uniformRouter);
router.use('/uniform-variants', uniformVariantRouter);
router.use('/media', mediaRouter);
router.use('/uniform-images', uniformImagesRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
router.use('/payments', paymentRouter);
router.use('/deliveries', deliveryRouter);
router.use('/audit', auditRouter);
router.use('/dashboard', dashboardRouter);

// Future module routes will be registered here

export default router;
