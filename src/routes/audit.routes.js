import express from 'express';
import auditController from '../controllers/audit.controller.js';
import { validate } from '../middleware/validator.js';
import { listAuditLogsSchema } from '../validations/audit.validation.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.post('/list', validate({ body: listAuditLogsSchema }), auditController.listAuditLogs);

export default router;
