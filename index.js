import app from './src/app.js';
import { config } from './src/config/environment.js';
import { logger } from './src/utils/logger.js';
import sequelize from './src/config/db.js';

const startServer = async () => {
  try {
    logger.info('Connecting to the database...');
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    const PORT = config.port;
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
      });
    }
  } catch (error) {
    logger.error('Failed to start the server due to database connection error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
