import '../config/environment.js';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import db from '../models/index.js';
import { logger } from '../utils/logger.js';

const NUM_USERS = 100;
const NUM_SCHOOLS = 50;
const NUM_CATEGORIES = 20;
const NUM_UNIFORMS = 200;
const NUM_VARIANTS_PER_UNIFORM = 3;

const seedDummyData = async () => {
  try {
    logger.info('Starting dummy data generation...');
    const runId = Date.now();

    // 1. Create Users, Profiles, Addresses
    const users = [];
    const profiles = [];
    const addresses = [];
    const passwordHash = await bcrypt.hash('Password@123', 10);

    for (let i = 0; i < NUM_USERS; i++) {
      users.push({
        role: 'CUSTOMER',
        email: `dummy_${runId}_${i}@example.com`,
        phone: faker.string.numeric(10) + (runId % 1000) + i, 
        password_hash: passwordHash,
        status: 'ACTIVE'
      });
    }
    const createdUsers = await db.User.bulkCreate(users, { returning: true });
    logger.info(`Created ${createdUsers.length} users`);

    for (const user of createdUsers) {
      profiles.push({
        user_id: user.id,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        gender: faker.helpers.arrayElement(['MALE', 'FEMALE', 'UNISEX'])
      });
      addresses.push({
        user_id: user.id,
        full_name: faker.person.fullName(),
        phone: user.phone,
        address_line_1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postal_code: faker.location.zipCode('######'),
        country: 'India',
        is_default: true
      });
    }
    await db.CustomerProfile.bulkCreate(profiles);
    await db.CustomerAddress.bulkCreate(addresses);
    logger.info('Created customer profiles and addresses');

    // 2. Create Schools
    const schools = [];
    for (let i = 0; i < NUM_SCHOOLS; i++) {
      schools.push({
        name: `School ${runId} ${i} ` + faker.company.name(),
        address: faker.location.streetAddress() + ', ' + faker.location.city(),
        contact_number: faker.string.numeric(10) + (runId % 1000) + i,
        email: `school_${runId}_${i}@example.com`,
        display_order: i + 1,
        status: 'ACTIVE'
      });
    }
    const createdSchools = await db.School.bulkCreate(schools, { returning: true });
    logger.info(`Created ${createdSchools.length} schools`);

    // 3. Create Categories
    const categories = [];
    for (let i = 0; i < NUM_CATEGORIES; i++) {
      categories.push({
        name: `Category ${runId} ${i} ` + faker.commerce.department(),
        description: faker.commerce.productDescription(),
        display_order: i + 1,
        status: 'ACTIVE'
      });
    }
    const createdCategories = await db.Category.bulkCreate(categories, { returning: true });
    logger.info(`Created ${createdCategories.length} categories`);

    // 4. Create Uniforms & Mappings
    const uniforms = [];
    for (let i = 0; i < NUM_UNIFORMS; i++) {
      const category = faker.helpers.arrayElement(createdCategories);
      uniforms.push({
        sku: `SKU_${runId}_${i}`,
        name: `Uniform ${runId} ${i} ` + faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category_id: category.id,
        status: 'ACTIVE',
        display_order: i + 1
      });
    }
    const createdUniforms = await db.Uniform.bulkCreate(uniforms, { returning: true });
    logger.info(`Created ${createdUniforms.length} uniforms`);

    const uniformSchoolMappings = [];
    for (const uniform of createdUniforms) {
      // link to 1-3 random schools
      const numSchools = faker.number.int({ min: 1, max: 3 });
      const pickedSchools = faker.helpers.arrayElements(createdSchools, numSchools);
      for (const school of pickedSchools) {
        uniformSchoolMappings.push({
          uniform_id: uniform.id,
          school_id: school.id
        });
      }
    }
    await db.UniformSchoolMapping.bulkCreate(uniformSchoolMappings);
    logger.info(`Created ${uniformSchoolMappings.length} uniform-school mappings`);

    // 5. Create Variants
    const variants = [];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34'];
    const genders = ['MALE', 'FEMALE', 'UNISEX'];
    for (const uniform of createdUniforms) {
      let createdCount = 0;
      for (const size of sizes) {
        for (const gender of genders) {
          if (createdCount >= NUM_VARIANTS_PER_UNIFORM) break;
          variants.push({
            uniform_id: uniform.id,
            size: size,
            gender: gender,
            price: faker.commerce.price({ min: 300, max: 2000 }),
            quantity_requirement: 1,
            status: 'ACTIVE',
            display_order: createdCount + 1
          });
          createdCount++;
        }
        if (createdCount >= NUM_VARIANTS_PER_UNIFORM) break;
      }
    }
    await db.UniformVariant.bulkCreate(variants);
    logger.info(`Created ${variants.length} uniform variants`);

    logger.info('Dummy data generation completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Dummy data generation failed:', error);
    process.exit(1);
  }
};

seedDummyData();
