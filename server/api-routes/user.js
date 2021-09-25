const express = require('express');
const { authMiddleware } = require('../middlewares');
const userService = require('../services/user');

const router = express.Router();

router.post('/auth', userService.auth);
router.post('/auth-confirm', userService.authComfirm);
router.put('/join', authMiddleware, userService.join);

module.exports = router;
