/**
 * Migration Runner
 *
 * Uses Sequelize's sync() to create all tables in dependency order.
 * Run with: node src/migration-query/migrate.js
 *
 * WARNING: { force: true } will DROP and recreate all tables.
 * Use { alter: true } in production to preserve data.
 */

import '../config/environment.js';
import db from '../models/index.js';
import { logger } from '../utils/logger.js';

const migrate = async () => {
  try {
    logger.info('Starting database migration...');

    // { force: true } in development to reset the schema cleanly.
    // Switch to { alter: true } once data needs to be preserved.
    await db.sequelize.sync({ force: true });

    logger.info('All tables created successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
