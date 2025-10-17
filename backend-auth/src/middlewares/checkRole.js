// checkRole.js
export const checkRole = (roles = []) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      // Nếu roles chỉ là 1 giá trị, ép thành mảng
      if (typeof roles === "string") roles = [roles];

      // Kiểm tra quyền
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied: insufficient role" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};
