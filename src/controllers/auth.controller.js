import authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response-handler.js';

export const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    return sendSuccess(res, data, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    return sendSuccess(res, data, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: tokenStr } = req.body;
    const data = await authService.refreshToken(tokenStr);
    return sendSuccess(res, data, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken: tokenStr } = req.body;
    await authService.logout(tokenStr);
    return sendSuccess(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await authService.forgotPassword(email);
    return sendSuccess(res, data, 'Forgot password request processed');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    return sendSuccess(res, null, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    await authService.changePassword(userId, currentPassword, newPassword);
    return sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword
};
