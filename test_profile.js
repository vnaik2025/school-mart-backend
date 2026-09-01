import db from './src/models/index.js';

(async () => {
  const profile = await db.CustomerProfile.findOne({ where: { user_id: 1 } });
  console.log("PROFILE:", profile);
  process.exit(0);
})();
