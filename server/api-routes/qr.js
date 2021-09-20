const express = require('express');
const qrService = require('../services/qr');

const router = express.Router();

router.get('/group', qrService.group);

module.exports = router;
