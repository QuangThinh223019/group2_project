const Log = require('../models/Log');

async function logActivity(userId, action, req) {
  try {
    await Log.create({
      userId: userId || null,
      action,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
  } catch (error) {
    console.error('❌ Error saving log:', error.message);
  }
}

module.exports = { logActivity };
