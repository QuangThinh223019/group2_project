const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });
const ctrl = require('../controllers/upload.controller');

router.post('/avatar', auth(), upload.single('avatar'), ctrl.uploadAvatar);

module.exports = router;
