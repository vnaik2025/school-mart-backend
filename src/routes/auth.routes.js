import express from 'express';
import authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validator.js';
import * as authValidation from '../validations/auth.validation.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', validate(authValidation.registerSchema), authController.register);
router.post('/login', validate(authValidation.loginSchema), authController.login);
router.post('/refresh-token', validate(authValidation.refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, validate(authValidation.logoutSchema), authController.logout);
router.post('/forgot-password', validate(authValidation.forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPasswordSchema), authController.resetPassword);
router.post('/change-password', authenticate, validate(authValidation.changePasswordSchema), authController.changePassword);

export default router;
