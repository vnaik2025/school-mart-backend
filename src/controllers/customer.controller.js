import customerService from '../services/customer.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const getProfile = async (req, res, next) => {
  try {
    const data = await customerService.getProfile(req.user.id);
    return sendSuccess(res, data, 'Profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await customerService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, data, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const listCustomers = async (req, res, next) => {
  try {
    const options = { ...req.query, ...req.body };
    const data = await customerService.listCustomers(options);
    return sendSuccess(res, data, 'Customers listed successfully');
  } catch (error) {
    next(error);
  }
};

export const getCustomerDetails = async (req, res, next) => {
  try {
    const data = await customerService.getCustomerDetails(req.params.id);
    return sendSuccess(res, data, 'Customer details fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateCustomerStatus = async (req, res, next) => {
  try {
    const data = await customerService.updateCustomerStatus(req.params.id, req.body.status);
    return sendSuccess(res, data, 'Customer status updated successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  listCustomers,
  getCustomerDetails,
  updateCustomerStatus
};
