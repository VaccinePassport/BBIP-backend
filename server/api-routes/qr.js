const express = require('express');
const qrService = require('../services/qr');

const router = express.Router();

router.get('/group', qrService.generateQroupQR);

module.exports = router;
