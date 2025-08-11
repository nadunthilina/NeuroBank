#!/usr/bin/env node
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB || undefined });
    const email = process.argv[2] || 'admin@neurobank.local';
    const pass = process.argv[3] || 'ChangeMe123!';
    let user = await User.findOne({ email });
    if (!user) {
      const passwordHash = await bcrypt.hash(pass, 10);
      user = await User.create({ name: 'Admin', email, passwordHash, role: 'admin' });
      console.log('Created admin:', email);
    } else {
      user.role = 'admin';
      await user.save();
      console.log('Updated to admin:', email);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
})();
