const express = require('express');
const { authMiddleware } = require('../middlewares');
const userService = require('../services/user');

const router = express.Router();

router.post('/auth', userService.auth);
router.post('/auth-confirm', userService.authConfirm);
router.put('/join', authMiddleware, userService.join);
router.get('/qr-password', authMiddleware, userService.getQrPwdWhether);
router.patch('/qr-password', authMiddleware, userService.setQrPwd);

module.exports = router;
