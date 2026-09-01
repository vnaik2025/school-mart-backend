import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';

export const createVariant = async (variantData, userId) => {
  const { uniform_id, size, gender } = variantData;

  const uniform = await db.Uniform.findOne({ where: { id: uniform_id, is_archive: false } });
  if (!uniform) {
    throw new APIError('Uniform not found', 404);
  }

  // Pre-check for composite uniqueness (including archived to prevent DB index violation)
  const existing = await db.UniformVariant.findOne({
    where: { uniform_id, size, gender }
  });

  if (existing) {
    if (existing.is_archive) {
      // Restore and update the archived variant
      await existing.update({
        ...variantData,
        is_archive: false,
        archived_at: null,
        archived_by: null,
        updated_by: userId
      });
      return existing;
    }
    throw new APIError('Variant with this size and gender already exists for this uniform', 409);
  }

  return await db.UniformVariant.create({
    ...variantData,
    created_by: userId
  });
};

export const updateVariant = async (variantId, updateData, userId) => {
  const variant = await db.UniformVariant.findOne({
    where: { id: variantId, is_archive: false }
  });
  if (!variant) {
    throw new APIError('Variant not found', 404);
  }

  const size = updateData.size || variant.size;
  const gender = updateData.gender || variant.gender;
  const uniformId = variant.uniform_id;

  if (size !== variant.size || gender !== variant.gender) {
    const existing = await db.UniformVariant.findOne({
      where: { uniform_id: uniformId, size, gender }
    });
    if (existing && existing.id !== variantId) {
      throw new APIError('Another variant with this size and gender already exists for this uniform', 409);
    }
  }

  await variant.update({
    ...updateData,
    updated_by: userId
  });
  return variant;
};

export const deleteVariant = async (variantId, userId) => {
  const variant = await db.UniformVariant.findOne({
    where: { id: variantId, is_archive: false }
  });
  if (!variant) {
    throw new APIError('Variant not found', 404);
  }

  await variant.update({
    is_archive: true,
    archived_at: new Date(),
    archived_by: userId
  });
};

export default {
  createVariant,
  updateVariant,
  deleteVariant
};
