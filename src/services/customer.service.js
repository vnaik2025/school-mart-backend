import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';
import { Op } from 'sequelize';

/**
 * Get profile for a customer
 * @param {number} userId 
 */
export const getProfile = async (userId) => {
  const user = await db.User.findByPk(userId, {
    attributes: ['id', 'email', 'phone', 'role', 'status'],
    include: [{
      model: db.CustomerProfile,
      attributes: ['first_name', 'last_name', 'profile_media_id']
    }]
  });

  if (!user) {
    throw new APIError('Customer not found', 404);
  }

  return user;
};

/**
 * Update profile for a customer
 * @param {number} userId 
 * @param {Object} updateData 
 */
export const updateProfile = async (userId, updateData) => {
  const profile = await db.CustomerProfile.findOne({ where: { user_id: userId } });
  if (!profile) {
    throw new APIError('Customer profile not found', 404);
  }

  await profile.update(updateData);
  return getProfile(userId);
};

/**
 * List all customers (Admin)
 */
export const listCustomers = async (options = {}) => {
  const { page = 1, limit = 10, search, status } = options;
  const offset = (page - 1) * limit;

  const where = { role: 'CUSTOMER' };
  
  if (status) {
    where.status = status;
  }

  const includeWhere = {};
  if (search) {
    const searchCondition = { [Op.iLike]: `%${search}%` };
    where[Op.or] = [
      { email: searchCondition },
      { phone: searchCondition }
    ];
    // To properly search across user and profile, it's a bit more complex,
    // but we'll stick to email and phone search for simplicity, 
    // or add first_name/last_name to includeWhere.
  }

  const { count, rows } = await db.User.findAndCountAll({
    where,
    attributes: ['id', 'email', 'phone', 'status', 'created_at'],
    include: [{
      model: db.CustomerProfile,
      attributes: ['first_name', 'last_name']
    }],
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });

  return {
    total: count,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    data: rows
  };
};

/**
 * Get details for a specific customer (Admin)
 * @param {number} customerId 
 */
export const getCustomerDetails = async (customerId) => {
  const user = await db.User.findOne({
    where: { id: customerId, role: 'CUSTOMER' },
    attributes: ['id', 'email', 'phone', 'status', 'created_at'],
    include: [
      {
        model: db.CustomerProfile,
        attributes: ['first_name', 'last_name', 'profile_media_id']
      },
      {
        model: db.CustomerAddress,
        where: { is_archive: false },
        required: false // LEFT JOIN
      }
    ]
  });

  if (!user) {
    throw new APIError('Customer not found', 404);
  }

  return user;
};

/**
 * Update a customer's status (Admin)
 * @param {number} customerId 
 * @param {string} status 
 */
export const updateCustomerStatus = async (customerId, status) => {
  const user = await db.User.findOne({ where: { id: customerId, role: 'CUSTOMER' } });
  
  if (!user) {
    throw new APIError('Customer not found', 404);
  }

  await user.update({ status });
  return { id: user.id, status: user.status };
};

export default {
  getProfile,
  updateProfile,
  listCustomers,
  getCustomerDetails,
  updateCustomerStatus
};
