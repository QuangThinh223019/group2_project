const Log = require('../models/Log');

exports.logActivity = (action) => {
  return async (req, res, next) => {
    try {
      const newLog = await Log.create({
        userId: req.user ? req.user.id : null,
        action,
        ip: req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        timestamp: new Date()
      });
      console.log(`✅ Activity logged: ${action} - ID: ${newLog._id}`);
    } catch (err) {
      console.error('❌ Log activity error:', err.message);
    }
    next();
  };
};
