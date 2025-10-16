const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { verifyAccessToken } = require('../middlewares/auth.middleware');

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh); 
router.post('/logout', verifyAccessToken, ctrl.logout);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

module.exports = router;
