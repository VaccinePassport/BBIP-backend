const express = require('express');
const { authMiddleware } = require('../middlewares');
const deviceTokenService = require('../services/deviceToken');

const router = express.Router(deviceTokenService.save);

router.post('/device', );

module.exports = router;
