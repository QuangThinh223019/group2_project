const rateLimitMap = new Map(); // key: IP, value: { count, timestamp }

exports.rateLimitLogin = (limit = 5, windowMs = 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
      return next();
    }

    const entry = rateLimitMap.get(ip);

    // Nếu hết thời gian tính toán
    if (now - entry.timestamp > windowMs) {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
      return next();
    }

    // Nếu vượt giới hạn
    if (entry.count >= limit) {
      return res.status(429).json({
        message: `Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau ${windowMs / 1000} giây.`,
      });
    }

    // Tăng đếm
    entry.count++;
    rateLimitMap.set(ip, entry);
    next();
  };
};
