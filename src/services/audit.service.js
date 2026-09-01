import db from '../models/index.js';
import { Op } from 'sequelize';

export const createAuditLog = async (data) => {
  return await db.AuditLog.create(data);
};

export const listAuditLogs = async (queryParams) => {
  const { page = 1, limit = 10, search, filters = {} } = queryParams;
  const offset = (page - 1) * limit;

  const where = {};

  if (filters.entity) where.entity = filters.entity;
  if (filters.action) where.action = filters.action;
  if (filters.user_id) where.user_id = filters.user_id;

  if (filters.startDate && filters.endDate) {
    where.created_at = {
      [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)]
    };
  }

  if (search) {
    where[Op.or] = [
      { request_url: { [Op.iLike]: `%${search}%` } },
      { action: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows } = await db.AuditLog.findAndCountAll({
    where,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['created_at', 'DESC']]
  });

  return {
    total: count,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    data: rows
  };
};

export default {
  createAuditLog,
  listAuditLogs
};
