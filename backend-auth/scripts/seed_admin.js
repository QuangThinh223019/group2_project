// scripts/seed-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User'); // chỉnh lại path nếu khác

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@gmail.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
    const name = process.env.SEED_ADMIN_NAME || 'admin';

    const exists = await User.findOne({ email });
    if (exists) {
      console.log('Seed: admin đã tồn tại ->', email);
      return process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, password: hash, role: 'admin' });
    console.log('Seed: tạo admin OK ->', u.email);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
