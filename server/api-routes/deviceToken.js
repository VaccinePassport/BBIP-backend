const express = require('express');
const { authMiddleware } = require('../middlewares');
const deviceTokenService = require('../services/deviceToken');

const router = express.Router();

router.post('/', deviceTokenService.save);

module.exports = router;
