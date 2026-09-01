import auditService from '../services/audit.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const listAuditLogs = async (req, res, next) => {
  try {
    const data = await auditService.listAuditLogs(req.body);
    return sendSuccess(res, data, 'Audit logs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  listAuditLogs
};
