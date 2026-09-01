import dashboardService from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const activities = await dashboardService.getRecentActivities();
    return sendSuccess(res, activities, 'Recent activities retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
  getRecentActivities
};
