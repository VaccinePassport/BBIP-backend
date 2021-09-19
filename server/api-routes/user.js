const express = require('express');
const { authMiddleware } = require('../middlewares');
const { userService } = require('../services');
const router = express.Router();

router.post('/join', userService.join(req,res,next));
router.patch('/auth', authMiddleware, userService.auth(req,res,next));

module.exports = router;
