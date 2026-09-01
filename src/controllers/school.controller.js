import schoolService from '../services/school.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const createSchool = async (req, res, next) => {
  try {
    const data = await schoolService.createSchool(req.body);
    return sendSuccess(res, data, 'School created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listSchools = async (req, res, next) => {
  try {
    const options = { ...req.query, ...req.body };
    const data = await schoolService.listSchools(options);
    return sendSuccess(res, data, 'Schools listed successfully');
  } catch (error) {
    next(error);
  }
};

export const getSchoolDetails = async (req, res, next) => {
  try {
    const data = await schoolService.getSchoolDetails(req.params.id);
    return sendSuccess(res, data, 'School details fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateSchool = async (req, res, next) => {
  try {
    const data = await schoolService.updateSchool(req.params.id, req.body);
    return sendSuccess(res, data, 'School updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteSchool = async (req, res, next) => {
  try {
    await schoolService.deleteSchool(req.params.id, req.user.id);
    return sendSuccess(res, null, 'School deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const updateSchoolStatus = async (req, res, next) => {
  try {
    const data = await schoolService.updateSchoolStatus(req.params.id, req.body.status);
    return sendSuccess(res, data, 'School status updated successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  createSchool,
  listSchools,
  getSchoolDetails,
  updateSchool,
  deleteSchool,
  updateSchoolStatus
};
