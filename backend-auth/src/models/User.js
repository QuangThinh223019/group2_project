const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin','moderator'], default: 'user' },
  avatarUrl: { type: String, default: '' },
  avatarPublicId: { type: String, default: '' },
  resetToken: { type: String, select: false, default: null },
  resetTokenExp: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
