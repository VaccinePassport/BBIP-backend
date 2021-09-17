const express = require('express');
const router = express.Router();
var sdk = require('../sdk');
const { user } = require('../models');

router.post('/', async (req, res, next) => {
    let { date, location, vaccine_type, vaccine_session } = req.body;
    let user_id = 'test@naver.com';

    // 중복 체크 어떻게 할 것 인지?

    let args = [
        user_id,
        date,
        vaccine_type,
        String(vaccine_session)
    ];

    let result = await sdk.send(true, 'putCertificate', args); 
    console.log(result);
    if (result == 'success') {
        res.status(201).send({});
    } else {
        res.status(400).send({ message: '알 수 없는 오류가 발생했습니다.' });
    }
});

router.get('/vaccine/:vaccineIndex', async (req, res, next) => {
    let { vaccineIndex } = req.params;

    let args = [String(vaccineIndex)];

    let result = await sdk.send(false, 'getCertificateByCertKey', args); 
    let resultJSON = JSON.parse(result);
    if (resultJSON.records == "") {
        res.send({});
    } else {
        res.send({
            date: resultJSON.records[0].record.date,
            location: resultJSON.records[0].record.location,
            vaccine_type: resultJSON.records[0].record.vaccinetype,
            vaccine_session: parseInt(
                resultJSON.records[0].record.veccinenumber
            ),
            user_id: resultJSON.records[0].record.userid,
            vaccine_index: resultJSON.records[0].vaccineKey,
        });
    }
});

router.get('/', async (req, res, next) => {
    let user_id = 'test@naver.com';

    let args = [user_id];
    let result = await sdk.send(false, 'getCertificateByUserId', args);
    let resultJSON = JSON.parse(result);

    let vaccineList = [];
    for (let vaccine of resultJSON.records) {
        vaccineList.push({
            date: vaccine.record.date,
            location: vaccine.record.location,
            vaccine_type: vaccine.record.vaccinetype,
            vaccine_session: parseInt(vaccine.record.veccinenumber),
            user_id: vaccine.record.userid,
            vaccine_index: vaccine.vaccineKey,
        });
    }
    res.send({ records: vaccineList });
});

module.exports = router;
