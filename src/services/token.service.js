import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/environment.js';
import db from '../models/index.js';

/**
 * Generate a JWT access token
 * @param {number} userId - The user's ID
 * @param {string} role - The user's role
 * @returns {string} The signed JWT
 */
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { sub: userId, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Generate a refresh token and save it to the database
 * @param {number} userId - The user's ID
 * @returns {Promise<string>} The generated refresh token
 */
export const generateRefreshToken = async (userId, options = {}) => {
  const token = crypto.randomBytes(40).toString('hex');
  
  // Parse expiration string like '7d' roughly, or default to 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await db.RefreshToken.create({
    user_id: userId,
    token,
    expires_at: expiresAt,
    revoked: false
  }, options);

  return token;
};

/**
 * Verify an access token
 * @param {string} token - The JWT token to verify
 * @returns {Object} The decoded payload if valid
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Revoke a refresh token
 * @param {string} token - The refresh token to revoke
 */
export const revokeRefreshToken = async (token) => {
  await db.RefreshToken.update(
    { revoked: true },
    { where: { token } }
  );
};

/**
 * Revoke all refresh tokens for a user
 * @param {number} userId - The user's ID
 */
export const revokeAllUserRefreshTokens = async (userId) => {
  await db.RefreshToken.update(
    { revoked: true },
    { where: { user_id: userId, revoked: false } }
  );
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens
};
