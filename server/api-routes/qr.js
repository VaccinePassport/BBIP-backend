const express = require('express');
const qrService = require('../services/qr');

const router = express.Router();

router.get('/group', qrService.makeGroupQr);
router.patch('/permission', qrService.acceptGroupQr);

module.exports = router;
