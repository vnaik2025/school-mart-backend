import express from 'express';
import { sendSuccess } from '../utils/response-handler.js';
import sequelize from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    await sequelize.authenticate();
    return sendSuccess(res, {
      database: 'connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }, 'Health check successful');
  } catch (error) {
    next(error);
  }
});

export default router;
