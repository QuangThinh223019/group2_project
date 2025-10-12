// src/routes/upload.routes.js
const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục lưu file nếu chưa có
const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
fs.mkdirSync(uploadDir, { recursive: true });

// Chỉ chấp nhận ảnh
const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (allowed.has(file.mimetype)) return cb(null, true);
    cb(new Error('INVALID_FILE_TYPE'));
  }
});

const ctrl = require('../controllers/upload.controller');

router.post(
  '/avatar',
  auth(), // bắt buộc đăng nhập
  (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
      if (err?.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ message: 'Chỉ chấp nhận JPEG/PNG/WEBP/AVIF' });
      }
      if (err) return res.status(400).json({ message: err.message || 'Lỗi upload' });
      next();
    });
  },
  ctrl.uploadAvatarLocal // xử lý resize + cập nhật DB
);

module.exports = router;
