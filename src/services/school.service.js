import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';
import { Op } from 'sequelize';

export const createSchool = async (schoolData) => {
  const existing = await db.School.findOne({ where: { name: schoolData.name } });
  if (existing) {
    throw new APIError('School with this name already exists', 409);
  }
  return await db.School.create(schoolData);
};

export const listSchools = async (options = {}) => {
  const { page = 1, limit = 10, search, status } = options;
  const offset = (page - 1) * limit;

  const where = { is_archive: false };
  if (status) {
    where.status = status;
  }

  if (search) {
    const searchCondition = { [Op.iLike]: `%${search}%` };
    where[Op.or] = [
      { name: searchCondition },
      { email: searchCondition },
      { address: searchCondition }
    ];
  }

  const { count, rows } = await db.School.findAndCountAll({
    where,
    limit,
    offset,
    order: [['display_order', 'ASC'], ['created_at', 'DESC']]
  });

  return {
    total: count,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    data: rows
  };
};

export const getSchoolDetails = async (schoolId) => {
  const school = await db.School.findOne({
    where: { id: schoolId, is_archive: false }
  });
  if (!school) {
    throw new APIError('School not found', 404);
  }
  return school;
};

export const updateSchool = async (schoolId, updateData) => {
  const school = await db.School.findOne({
    where: { id: schoolId, is_archive: false }
  });
  if (!school) {
    throw new APIError('School not found', 404);
  }
  
  if (updateData.name && updateData.name !== school.name) {
    const existing = await db.School.findOne({ where: { name: updateData.name } });
    if (existing) {
      throw new APIError('School name already exists', 409);
    }
  }

  await school.update(updateData);
  return school;
};

export const deleteSchool = async (schoolId, userId) => {
  const school = await db.School.findOne({
    where: { id: schoolId, is_archive: false }
  });
  if (!school) {
    throw new APIError('School not found', 404);
  }

  await school.update({
    is_archive: true,
    archived_at: new Date(),
    archived_by: userId
  });
};

export const updateSchoolStatus = async (schoolId, status) => {
  const school = await db.School.findOne({
    where: { id: schoolId, is_archive: false }
  });
  if (!school) {
    throw new APIError('School not found', 404);
  }

  await school.update({ status });
  return school;
};

export default {
  createSchool,
  listSchools,
  getSchoolDetails,
  updateSchool,
  deleteSchool,
  updateSchoolStatus
};
