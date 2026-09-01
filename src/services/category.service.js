import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';
import { Op } from 'sequelize';

export const createCategory = async (categoryData) => {
  const existing = await db.Category.findOne({ where: { name: categoryData.name } });
  if (existing) {
    throw new APIError('Category with this name already exists', 409);
  }
  return await db.Category.create(categoryData);
};

export const listCategories = async (options = {}) => {
  const { page = 1, limit = 10, search, status } = options;
  const offset = (page - 1) * limit;

  const where = { is_archive: false };
  if (status) {
    where.status = status;
  }

  if (search) {
    where.name = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows } = await db.Category.findAndCountAll({
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

export const getCategory = async (categoryId) => {
  const category = await db.Category.findOne({
    where: { id: categoryId, is_archive: false }
  });
  if (!category) {
    throw new APIError('Category not found', 404);
  }
  return category;
};

export const updateCategory = async (categoryId, updateData) => {
  const category = await db.Category.findOne({
    where: { id: categoryId, is_archive: false }
  });
  if (!category) {
    throw new APIError('Category not found', 404);
  }

  if (updateData.name && updateData.name !== category.name) {
    const existing = await db.Category.findOne({ where: { name: updateData.name } });
    if (existing) {
      throw new APIError('Category name already exists', 409);
    }
  }

  await category.update(updateData);
  return category;
};

export const deleteCategory = async (categoryId, userId) => {
  const category = await db.Category.findOne({
    where: { id: categoryId, is_archive: false }
  });
  if (!category) {
    throw new APIError('Category not found', 404);
  }

  await category.update({
    is_archive: true,
    archived_at: new Date(),
    archived_by: userId
  });
};

export default {
  createCategory,
  listCategories,
  getCategory,
  updateCategory,
  deleteCategory
};
