const ActivityLog = require('../models/ActivityLog');

exports.logActivity = (action) => {
  return async (req, res, next) => {
    try {
      await ActivityLog.create({
        userId: req.user ? req.user.id : null,
        action,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
    } catch (err) {
      console.error('Log activity error:', err);
    }
    next();
  };
};
