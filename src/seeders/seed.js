/**
 * Seeder
 *
 * Seeds the database with initial data:
 *  - Admin user
 *  - Customer user with profile and address
 *  - Sample schools
 *  - Sample categories
 *
 * Run with: node src/seeders/seed.js
 */

import '../config/environment.js';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { logger } from '../utils/logger.js';

const seed = async () => {
  try {
    logger.info('Starting database seeding...');

    // ── Admin User ──────────────────────────────────────────────────────────
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const [admin] = await db.User.findOrCreate({
      where: { email: 'admin@schoolmart.com' },
      defaults: {
        role: 'ADMIN',
        email: 'admin@schoolmart.com',
        phone: '9000000001',
        password_hash: adminPassword,
        status: 'ACTIVE'
      }
    });
    logger.info(`Admin user ready (id: ${admin.id})`);

    // ── Customer User ───────────────────────────────────────────────────────
    const customerPassword = await bcrypt.hash('Customer@123', 10);
    const [customer] = await db.User.findOrCreate({
      where: { email: 'customer@example.com' },
      defaults: {
        role: 'CUSTOMER',
        email: 'customer@example.com',
        phone: '9000000002',
        password_hash: customerPassword,
        status: 'ACTIVE'
      }
    });
    logger.info(`Customer user ready (id: ${customer.id})`);

    // ── Customer Profile ────────────────────────────────────────────────────
    await db.CustomerProfile.findOrCreate({
      where: { user_id: customer.id },
      defaults: {
        user_id: customer.id,
        first_name: 'John',
        last_name: 'Doe'
      }
    });
    logger.info('Customer profile ready');

    // ── Customer Address ────────────────────────────────────────────────────
    const existingAddress = await db.CustomerAddress.findOne({ where: { user_id: customer.id } });
    if (!existingAddress) {
      await db.CustomerAddress.create({
        user_id: customer.id,
        full_name: 'John Doe',
        phone: '9000000002',
        address_line_1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400001',
        country: 'India',
        is_default: true
      });
    }
    logger.info('Customer address ready');

    // ── Schools ─────────────────────────────────────────────────────────────
    const schoolsData = [
      { name: 'St. Mary School', address: '45 Church Road, Pune, Maharashtra 411001', contact_number: '9100000001', email: 'info@stmary.edu', display_order: 1 },
      { name: 'Delhi Public School', address: '78 Sector 12, Noida, UP 201301', contact_number: '9100000002', email: 'info@dps.edu', display_order: 2 },
      { name: 'Kendriya Vidyalaya', address: '22 Central Avenue, Bangalore, Karnataka 560001', contact_number: '9100000003', email: 'info@kv.edu', display_order: 3 }
    ];

    for (const school of schoolsData) {
      await db.School.findOrCreate({ where: { name: school.name }, defaults: school });
    }
    logger.info('Schools ready');

    // ── Categories ──────────────────────────────────────────────────────────
    const categoriesData = [
      { name: 'Shirt', description: 'School shirts for all grades', display_order: 1 },
      { name: 'Pant', description: 'School trousers and pants', display_order: 2 },
      { name: 'Skirt', description: 'School skirts for girls', display_order: 3 },
      { name: 'Sweater', description: 'Winter sweaters and pullovers', display_order: 4 },
      { name: 'Shoes', description: 'School shoes for all students', display_order: 5 },
      { name: 'Socks', description: 'School socks in various sizes', display_order: 6 },
      { name: 'Belt', description: 'School belts', display_order: 7 },
      { name: 'Tie', description: 'School ties and accessories', display_order: 8 }
    ];

    for (const cat of categoriesData) {
      await db.Category.findOrCreate({ where: { name: cat.name }, defaults: cat });
    }
    logger.info('Categories ready');

    logger.info('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
