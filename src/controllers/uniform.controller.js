import uniformService from '../services/uniform.service.js';
import uniformVariantService from '../services/uniform-variant.service.js';
import { sendSuccess } from '../utils/response-handler.js';

// --- Uniform CRUD ---

export const createUniform = async (req, res, next) => {
  try {
    const data = await uniformService.createUniform(req.body, req.user.id);
    return sendSuccess(res, data, 'Uniform created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listUniforms = async (req, res, next) => {
  try {
    const options = { ...req.query, ...req.body };
    const data = await uniformService.listUniforms(options);
    return sendSuccess(res, data, 'Uniforms listed successfully');
  } catch (error) {
    next(error);
  }
};

export const getUniformDetails = async (req, res, next) => {
  try {
    const data = await uniformService.getUniformDetails(req.params.id);
    return sendSuccess(res, data, 'Uniform details fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateUniform = async (req, res, next) => {
  try {
    const data = await uniformService.updateUniform(req.params.id, req.body, req.user.id);
    return sendSuccess(res, data, 'Uniform updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteUniform = async (req, res, next) => {
  try {
    await uniformService.deleteUniform(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Uniform deleted successfully');
  } catch (error) {
    next(error);
  }
};

// --- Uniform Variant CRUD ---

export const createVariant = async (req, res, next) => {
  try {
    const data = await uniformVariantService.createVariant(req.body, req.user.id);
    return sendSuccess(res, data, 'Variant created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateVariant = async (req, res, next) => {
  try {
    const data = await uniformVariantService.updateVariant(req.params.id, req.body, req.user.id);
    return sendSuccess(res, data, 'Variant updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteVariant = async (req, res, next) => {
  try {
    await uniformVariantService.deleteVariant(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Variant deleted successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  createUniform,
  listUniforms,
  getUniformDetails,
  updateUniform,
  deleteUniform,
  createVariant,
  updateVariant,
  deleteVariant
};
