const jwt = require('jsonwebtoken');
module.exports = (required = true) => (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token && required) return res.status(401).json({ message: 'Unauthorized' });
  if (!token && !required) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
