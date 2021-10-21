const express = require('express');
const qrService = require('../services/qr');

const router = express.Router();

router.post('/group', qrService.makeGroupQr);
router.post('/individual', qrService.makeIndividualQr);
router.patch('/permission', qrService.acceptGroupQr);

module.exports = router;
