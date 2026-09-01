import { logger } from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

    if (statusCode >= 500) {
      logger.error(message, null, { ip, rid: req.rid });
    } else if (statusCode >= 400) {
      logger.warn(message, { ip, rid: req.rid });
    } else {
      logger.info(message, { ip, rid: req.rid });
    }
  });

  next();
};
