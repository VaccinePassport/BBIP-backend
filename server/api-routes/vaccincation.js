const express = require('express');
const vaccincationService  = require('../services/vaccincation');

const router = express.Router();

router.post('/', vaccincationService.addVaccine);
router.get('/', vaccincationService.getVaccineByEmail);
router.get('/vaccine/:vaccineIndex', vaccincationService.getVaccineByIndex);

module.exports = router;
