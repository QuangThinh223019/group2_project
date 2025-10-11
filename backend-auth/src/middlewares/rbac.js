module.exports.requireRole = (...roles) => {
  return (req, res, next) => {
    try {
      // auth() trước đó đã gắn req.user = { id, role }
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Chưa đăng nhập' });
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Không đủ quyền truy cập' });
      }
      next();
    } catch (e) {
      res.status(500).json({ message: 'Lỗi server', detail: e.message });
    }
  };
};
