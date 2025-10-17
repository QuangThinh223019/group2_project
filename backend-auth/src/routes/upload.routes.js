const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const ctrl = require('../controllers/upload.controller');

const allowed = new Set(['image/jpeg','image/png','image/webp','image/avif']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!allowed.has(file.mimetype)) {
      const err = new Error('INVALID_FILE_TYPE');
      return cb(err, false);
    }
    cb(null, true);
  }
});

router.post(
  '/avatar',
  auth(),
  (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
      if (err?.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ message: 'Chỉ chấp nhận JPEG/PNG/WEBP/AVIF' });
      }
      if (err) return res.status(400).json({ message: err.message || 'Lỗi upload' });
      next();
    });
  },
  ctrl.uploadAvatarCloudinary
);

module.exports = router;