const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  action: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
