const express = require('express');
const qrService = require('../services/qr');

const router = express.Router();

router.get('/group', qrService.generateGroupQR);
router.patch('/permission', qrService.permission);

module.exports = router;
