import categoryService from '../services/category.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const createCategory = async (req, res, next) => {
  try {
    const data = await categoryService.createCategory(req.body);
    return sendSuccess(res, data, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listCategories = async (req, res, next) => {
  try {
    const options = { ...req.query, ...req.body };
    const data = await categoryService.listCategories(options);
    return sendSuccess(res, data, 'Categories listed successfully');
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const data = await categoryService.getCategory(req.params.id);
    return sendSuccess(res, data, 'Category fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const data = await categoryService.updateCategory(req.params.id, req.body);
    return sendSuccess(res, data, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  createCategory,
  listCategories,
  getCategory,
  updateCategory,
  deleteCategory
};
