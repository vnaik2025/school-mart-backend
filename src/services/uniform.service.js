import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';
import { Op } from 'sequelize';

export const createUniform = async (uniformData, userId) => {
  const { school_ids, ...rest } = uniformData;

  // Validate category exists
  const category = await db.Category.findOne({ where: { id: rest.category_id, is_archive: false } });
  if (!category) {
    throw new APIError('Category not found', 404);
  }

  // Validate unique SKU
  const existingSku = await db.Uniform.findOne({ where: { sku: rest.sku } });
  if (existingSku) {
    throw new APIError('Uniform with this SKU already exists', 409);
  }

  const result = await db.sequelize.transaction(async (t) => {
    const uniform = await db.Uniform.create({
      ...rest,
      created_by: userId
    }, { transaction: t });

    if (school_ids && school_ids.length > 0) {
      // Validate schools exist
      const schools = await db.School.findAll({
        where: { id: school_ids, is_archive: false },
        transaction: t
      });
      if (schools.length !== school_ids.length) {
        throw new APIError('One or more school IDs are invalid', 400);
      }

      const mappings = school_ids.map(school_id => ({
        school_id,
        uniform_id: uniform.id,
        created_by: userId
      }));

      await db.UniformSchoolMapping.bulkCreate(mappings, { transaction: t });
    }

    return uniform;
  });

  return result;
};

export const listUniforms = async (options = {}) => {
  const { page = 1, limit = 10, search, category_id, school_id, gender, status } = options;
  const offset = (page - 1) * limit;

  const where = { is_archive: false };
  if (status) {
    where.status = status;
  }
  if (category_id) {
    where.category_id = category_id;
  }

  if (search) {
    const searchCondition = { [Op.iLike]: `%${search}%` };
    where[Op.or] = [
      { name: searchCondition },
      { sku: searchCondition },
      { description: searchCondition }
    ];
  }

  const include = [
    {
      model: db.Category,
      attributes: ['id', 'name'],
      where: { is_archive: false },
      required: false
    }
  ];

  // Include schools mapping
  const schoolMappingInclude = {
    model: db.UniformSchoolMapping,
    attributes: ['school_id'],
    required: false
  };

  if (school_id) {
    schoolMappingInclude.where = { school_id };
    schoolMappingInclude.required = true;
  }
  include.push(schoolMappingInclude);

  // Filter by gender: gender is inside UniformVariant.
  const variantInclude = {
    model: db.UniformVariant,
    attributes: ['id', 'size', 'gender', 'price', 'quantity_requirement', 'status'],
    where: { is_archive: false },
    required: false
  };

  if (gender) {
    variantInclude.where.gender = gender;
    variantInclude.required = true;
  }
  include.push(variantInclude);

  const { count, rows } = await db.Uniform.findAndCountAll({
    where,
    include,
    limit,
    offset,
    distinct: true,
    order: [['display_order', 'ASC'], ['created_at', 'DESC']]
  });

  return {
    total: count,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    data: rows
  };
};

export const getUniformDetails = async (uniformId) => {
  const uniform = await db.Uniform.findOne({
    where: { id: uniformId, is_archive: false },
    include: [
      {
        model: db.Category,
        attributes: ['id', 'name']
      },
      {
        model: db.UniformVariant,
        where: { is_archive: false },
        required: false
      },
      {
        model: db.UniformSchoolMapping,
        include: [{
          model: db.School,
          attributes: ['id', 'name', 'status']
        }],
        required: false
      }
    ]
  });

  if (!uniform) {
    throw new APIError('Uniform not found', 404);
  }

  return uniform;
};

export const updateUniform = async (uniformId, updateData, userId) => {
  const { school_ids, ...rest } = updateData;

  const uniform = await db.Uniform.findOne({
    where: { id: uniformId, is_archive: false }
  });
  if (!uniform) {
    throw new APIError('Uniform not found', 404);
  }

  if (rest.category_id) {
    const category = await db.Category.findOne({ where: { id: rest.category_id, is_archive: false } });
    if (!category) {
      throw new APIError('Category not found', 404);
    }
  }

  if (rest.sku && rest.sku !== uniform.sku) {
    const existingSku = await db.Uniform.findOne({ where: { sku: rest.sku } });
    if (existingSku) {
      throw new APIError('Uniform with this SKU already exists', 409);
    }
  }

  const result = await db.sequelize.transaction(async (t) => {
    await uniform.update({
      ...rest,
      updated_by: userId
    }, { transaction: t });

    if (school_ids) {
      // Validate schools exist
      const schools = await db.School.findAll({
        where: { id: school_ids, is_archive: false },
        transaction: t
      });
      if (schools.length !== school_ids.length) {
        throw new APIError('One or more school IDs are invalid', 400);
      }

      // Remove mappings that are no longer present
      await db.UniformSchoolMapping.destroy({
        where: {
          uniform_id: uniformId,
          school_id: { [Op.notIn]: school_ids }
        },
        transaction: t
      });

      // Find or create mappings for the rest
      for (const school_id of school_ids) {
        await db.UniformSchoolMapping.findOrCreate({
          where: { uniform_id: uniformId, school_id },
          defaults: { created_by: userId },
          transaction: t
        });
      }
    }

    return uniform;
  });

  return result;
};

export const deleteUniform = async (uniformId, userId) => {
  const uniform = await db.Uniform.findOne({
    where: { id: uniformId, is_archive: false }
  });
  if (!uniform) {
    throw new APIError('Uniform not found', 404);
  }

  await db.sequelize.transaction(async (t) => {
    await uniform.update({
      is_archive: true,
      archived_at: new Date(),
      archived_by: userId
    }, { transaction: t });

    // Also soft-delete its variants and mappings for consistency
    await db.UniformVariant.update(
      {
        is_archive: true,
        archived_at: new Date(),
        archived_by: userId
      },
      { where: { uniform_id: uniformId, is_archive: false }, transaction: t }
    );
  });
};

export default {
  createUniform,
  listUniforms,
  getUniformDetails,
  updateUniform,
  deleteUniform
};
