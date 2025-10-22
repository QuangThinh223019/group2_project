const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');
const { logActivity } = require('../middlewares/logActivity');
const { rateLimitLogin } = require('../middlewares/rateLimit');


// Đăng ký tài khoản
router.post('/signup', logActivity('SIGNUP'), ctrl.signup);

// Giới hạn 5 lần đăng nhập mỗi phút, ghi log
router.post('/login', rateLimitLogin(5, 60000), logActivity('LOGIN'), ctrl.login);

// Đăng xuất có xác thực
router.post('/logout', auth(), logActivity('LOGOUT'), ctrl.logout);

// Quên mật khẩu
router.post('/forgot-password', logActivity('FORGOT_PASSWORD'), ctrl.forgotPassword);

// Đặt lại mật khẩu
router.post('/reset-password', logActivity('RESET_PASSWORD'), ctrl.resetPassword);

// Làm mới token
router.post('/refresh', logActivity('REFRESH_TOKEN'), ctrl.refreshToken);

module.exports = router;
