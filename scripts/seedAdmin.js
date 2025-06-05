// backend/scripts/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Admin    = require('../models/Admin');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'udomwisdom466@gmail.com';
    const password = 'MyStrongP@sswordWisdom08053368576092';

    // check if exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists ➜', email);
      process.exit();
    }

    const hash = await bcrypt.hash(password, 10);
    await Admin.create({
      username: 'admin',
      email,
      password: hash,
      isAdmin: true,
    });

    console.log('✅  Admin created:');
    console.log('   email   :', email);
    console.log('   password:', password);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();