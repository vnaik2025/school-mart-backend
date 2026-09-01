import { verifyAccessToken } from '../services/token.service.js';
import { APIError } from '../utils/api-error.js';

/**
 * Middleware to authenticate a user using a JWT access token
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new APIError('Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Attach user payload to request
    req.user = {
      id: decoded.sub,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(new APIError('Access token expired', 401));
    } else {
      next(new APIError('Invalid token or authentication failed', 401));
    }
  }
};

/**
 * Middleware to authorize specific roles
 * @param {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new APIError('Forbidden: Insufficient permissions', 403));
    }
    next();
  };
};

export default {
  authenticate,
  authorize
};
