import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import db from '../models/index.js';
import { APIError } from '../utils/api-error.js';
import tokenService from './token.service.js';
import { Op } from 'sequelize';

/**
 * Register a new customer
 */
export const register = async (userData) => {
  const { first_name, last_name, email, phone, password } = userData;

  // Check if user exists
  const existingUser = await db.User.findOne({
    where: {
      [Op.or]: [{ email }, { phone }]
    }
  });

  if (existingUser) {
    throw new APIError('Email or phone already registered', 409);
  }

  // Hash password
  const password_hash = await bcryptjs.hash(password, 10);

  // Use transaction to ensure both User and CustomerProfile are created
  const result = await db.sequelize.transaction(async (t) => {
    const user = await db.User.create({
      role: 'CUSTOMER',
      email,
      phone,
      password_hash,
      status: 'ACTIVE'
    }, { transaction: t });

    await db.CustomerProfile.create({
      user_id: user.id,
      first_name,
      last_name
    }, { transaction: t });

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user.id, user.role);
    const refreshToken = await tokenService.generateRefreshToken(user.id, { transaction: t });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        first_name,
        last_name
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  });

  return result;
};

/**
 * Login a user
 */
export const login = async (email, password) => {
  const user = await db.User.findOne({ where: { email } });

  if (!user || user.status !== 'ACTIVE') {
    throw new APIError('Invalid credentials or inactive account', 401);
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new APIError('Invalid credentials', 401);
  }

  const accessToken = tokenService.generateAccessToken(user.id, user.role);
  const refreshToken = await tokenService.generateRefreshToken(user.id);

  let profile = null;
  if (user.role === 'CUSTOMER') {
    profile = await db.CustomerProfile.findOne({ where: { user_id: user.id } });
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      first_name: profile?.first_name,
      last_name: profile?.last_name
    },
    tokens: {
      accessToken,
      refreshToken
    }
  };
};

/**
 * Refresh an access token using a refresh token
 */
export const refreshToken = async (tokenStr) => {
  const tokenRecord = await db.RefreshToken.findOne({
    where: { token: tokenStr }
  });

  if (!tokenRecord) {
    throw new APIError('Invalid refresh token', 401);
  }

  if (tokenRecord.revoked) {
    throw new APIError('Refresh token is revoked', 401);
  }

  if (new Date() > tokenRecord.expires_at) {
    throw new APIError('Refresh token is expired', 401);
  }

  const user = await db.User.findByPk(tokenRecord.user_id);
  if (!user || user.status !== 'ACTIVE') {
    throw new APIError('User not found or inactive', 401);
  }

  const accessToken = tokenService.generateAccessToken(user.id, user.role);
  // Optionally, we could implement token rotation here.
  
  return {
    accessToken,
    refreshToken: tokenStr
  };
};

/**
 * Logout by revoking the refresh token
 */
export const logout = async (tokenStr) => {
  if (tokenStr) {
    await tokenService.revokeRefreshToken(tokenStr);
  }
};

/**
 * Logout all devices by revoking all user refresh tokens
 */
export const logoutAllDevices = async (userId) => {
  await tokenService.revokeAllUserRefreshTokens(userId);
};

/**
 * Generate a password reset token
 */
export const forgotPassword = async (email) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user || user.status !== 'ACTIVE') {
    // For security, don't indicate whether the email exists
    return { message: 'If that email exists, a reset link will be sent.' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

  await db.PasswordResetToken.create({
    user_id: user.id,
    token,
    expires_at: expiresAt,
    used: false
  });

  // Future: Send email with token here.
  return { token, message: 'Reset token generated (email sending pending)' };
};

/**
 * Reset password using a reset token
 */
export const resetPassword = async (token, newPassword) => {
  const resetToken = await db.PasswordResetToken.findOne({
    where: { token, used: false }
  });

  if (!resetToken) {
    throw new APIError('Invalid or used reset token', 400);
  }

  if (new Date() > resetToken.expires_at) {
    throw new APIError('Reset token has expired', 400);
  }

  const password_hash = await bcryptjs.hash(newPassword, 10);
  await db.sequelize.transaction(async (t) => {
    await db.User.update(
      { password_hash },
      { where: { id: resetToken.user_id }, transaction: t }
    );
    await db.PasswordResetToken.update(
      { used: true },
      { where: { id: resetToken.id }, transaction: t }
    );
    // Invalidate all active sessions for security
    await db.RefreshToken.update(
      { revoked: true },
      { where: { user_id: resetToken.user_id, revoked: false }, transaction: t }
    );
  });
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await db.User.findByPk(userId);
  if (!user) {
    throw new APIError('User not found', 404);
  }

  const isValid = await bcryptjs.compare(currentPassword, user.password_hash);
  if (!isValid) {
    throw new APIError('Incorrect current password', 400);
  }

  const password_hash = await bcryptjs.hash(newPassword, 10);
  await user.update({ password_hash });
};

export default {
  register,
  login,
  refreshToken,
  logout,
  logoutAllDevices,
  forgotPassword,
  resetPassword,
  changePassword
};
