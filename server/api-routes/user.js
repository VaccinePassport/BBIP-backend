const express = require('express');
const { authMiddleware } = require('../middlewares');
const userService = require('../services/user');

const router = express.Router();

router.post('/join', userService.join);
router.patch('/auth', authMiddleware, userService.auth);

module.exports = router;
