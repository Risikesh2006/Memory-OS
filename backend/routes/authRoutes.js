const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { otpRequestLimiter, otpVerifyLimiter } = require('../middleware/otpRateLimit');

// Phone OTP (primary auth path)
router.post('/otp/request', otpRequestLimiter, authController.requestOtp);
router.post('/otp/verify', otpVerifyLimiter, authController.verifyOtp);
router.post('/session/refresh', authController.refreshSession);
router.post('/logout', authMiddleware, authController.logout);
router.post('/logout-all', authMiddleware, authController.logoutAllDevices);
router.post('/phone/change/request', authMiddleware, authController.requestPhoneChange);
router.post('/phone/change/confirm', authMiddleware, authController.confirmPhoneChange);
router.delete('/account', authMiddleware, authController.deleteAccount);

// Email/password (secondary, linkable identity)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
