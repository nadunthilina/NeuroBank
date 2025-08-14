const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  circadianType: { type: String, enum: ['morning', 'evening', 'neutral'], default: 'neutral' },
  role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user', index: true },
  status: { type: String, enum: ['active', 'disabled'], default: 'active', index: true },
}, { timestamps: true });

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
