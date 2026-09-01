import addressService from '../services/address.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const createAddress = async (req, res, next) => {
  try {
    const data = await addressService.createAddress(req.user.id, req.body);
    return sendSuccess(res, data, 'Address created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const data = await addressService.getAddresses(req.user.id);
    return sendSuccess(res, data, 'Addresses retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await addressService.updateAddress(req.user.id, id, req.body);
    return sendSuccess(res, data, 'Address updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    await addressService.deleteAddress(req.user.id, id);
    return sendSuccess(res, null, 'Address deleted successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress
};
