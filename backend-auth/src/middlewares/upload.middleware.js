const multer = require('multer');
const path = require('path');

// Lưu file tạm trước khi đẩy lên Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.random().toString(36).slice(2) + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allow = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
  cb(allow ? null : new Error('Chỉ chấp nhận JPG, PNG, WEBP'), allow);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
