const express = require('express');
const qrService = require('../services/qr');

const router = express.Router();

router.get('/group', qrService.generateGroupQR);

module.exports = router;
