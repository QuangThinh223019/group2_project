// src/routes/upload.routes.js
const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ctrl = require('../controllers/upload.controller');

// Tạo thư mục lưu file nếu chưa có
const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
fs.mkdirSync(uploadDir, { recursive: true });

// Chỉ chấp nhận ảnh
const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // đặt tên an toàn + duy nhất
    const time = Date.now();
    const rand = Math.round(Math.random() * 1e9);
    // lấy đuôi từ mimetype (vd: image/png -> .png)
    const ext = file.mimetype.split('/')[1] || 'png';
    cb(null, `u${req.user?.id || 'anon'}_${time}_${rand}.${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!allowed.has(file.mimetype)) {
    const err = new Error('INVALID_FILE_TYPE');
    return cb(err, false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /api/upload/avatar
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
