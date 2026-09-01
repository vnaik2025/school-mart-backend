import { Op } from 'sequelize';
import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';

/**
 * Handle default address logic
 */
const handleDefaultAddress = async (userId, addressId, transaction) => {
  // If this address is set to default, unset all others for this user
  await db.CustomerAddress.update(
    { is_default: false },
    { 
      where: { 
        user_id: userId, 
        id: { [Op.ne]: addressId }
      },
      transaction
    }
  );
};

export const createAddress = async (userId, addressData) => {
  const result = await db.sequelize.transaction(async (t) => {
    // If it's the first address, make it default automatically
    const existingCount = await db.CustomerAddress.count({ 
      where: { user_id: userId, is_archive: false },
      transaction: t
    });

    if (existingCount === 0) {
      addressData.is_default = true;
    }

    const address = await db.CustomerAddress.create({
      ...addressData,
      user_id: userId
    }, { transaction: t });

    if (address.is_default) {
      await handleDefaultAddress(userId, address.id, t);
    }

    return address;
  });

  return result;
};

export const getAddresses = async (userId) => {
  return await db.CustomerAddress.findAll({
    where: { 
      user_id: userId,
      is_archive: false 
    },
    order: [['is_default', 'DESC'], ['created_at', 'DESC']]
  });
};

export const updateAddress = async (userId, addressId, addressData) => {
  const result = await db.sequelize.transaction(async (t) => {
    const address = await db.CustomerAddress.findOne({
      where: { id: addressId, user_id: userId, is_archive: false },
      transaction: t
    });

    if (!address) {
      throw new APIError('Address not found', 404);
    }

    await address.update(addressData, { transaction: t });

    if (addressData.is_default) {
      await handleDefaultAddress(userId, address.id, t);
    }

    return address;
  });

  return result;
};

export const deleteAddress = async (userId, addressId) => {
  const address = await db.CustomerAddress.findOne({
    where: { id: addressId, user_id: userId, is_archive: false }
  });

  if (!address) {
    throw new APIError('Address not found', 404);
  }

  if (address.is_default) {
    throw new APIError('Cannot delete the default address', 400);
  }

  await address.update({ 
    is_archive: true,
    archived_at: new Date(),
    archived_by: userId
  });
};

export default {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress
};
