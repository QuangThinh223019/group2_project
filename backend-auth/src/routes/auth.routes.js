const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');
const { logActivity } = require('../middlewares/logActivity');
const { rateLimitLogin } = require('../middlewares/rateLimit');

// 🧩 Đăng ký tài khoản
router.post('/signup', logActivity('User Signup Attempt'), ctrl.signup);

// 🧩 Giới hạn 5 lần đăng nhập mỗi phút, ghi log
router.post(
  '/login',
  rateLimitLogin(5, 60000), // tối đa 5 lần / phút
  logActivity('User Login Attempt'),
  ctrl.login
);

// 🧩 Đăng xuất (cần xác thực)
router.post('/logout', auth(), logActivity('User Logout'), ctrl.logout);

// 🧩 Quên mật khẩu
router.post('/forgot-password', logActivity('User Forgot Password'), ctrl.forgotPassword);

// 🧩 Đặt lại mật khẩu
router.post('/reset-password', logActivity('User Reset Password'), ctrl.resetPassword);

// 🧩 Làm mới token
router.post('/refresh', logActivity('User Refresh Token'), ctrl.refreshToken);

module.exports = router;
