const express = require('express');
const { authMiddleware } = require('../middlewares');
const userService = require('../services/friends');

const router = express.Router();

router.post('/auth', friendService.list);

module.exports = router;
