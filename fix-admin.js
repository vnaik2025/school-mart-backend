import './src/config/environment.js';
import bcrypt from 'bcryptjs';
import db from './src/models/index.js';

const fix = async () => {
  try {
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    await db.User.update(
      { password_hash: adminPassword },
      { where: { email: 'admin@schoolmart.com' } }
    );
    console.log('Admin password successfully forcefully updated to Admin@123');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fix();
