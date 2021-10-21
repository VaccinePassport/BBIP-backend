const express = require('express');
const qrService = require('../services/qr');

const router = express.Router();

router.post('/group', qrService.makeGroupQr);
router.post('/individual', qrService.makeIndividualQr);
router.post('/individual/:vaccineIndex', qrService.makeIndividualQrByIndex);
router.patch('/permission', qrService.acceptGroupQr);
router.get('/verify/:qrVaccine', qrService.verifyQr);

module.exports = router;
