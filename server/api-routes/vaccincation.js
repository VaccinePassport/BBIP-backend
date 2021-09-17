const express = require('express');
const router = express.Router();
var sdk = require('../sdk');
const { user } = require('../models');


router.post('/', async (req, res, next) => {
    let { date, location, vaccine_type, vaccine_session } = req.body;
    let user_id = "test@naver.com"

    // 중복 체크 어떻게 할 것 인지?
    
    let args = [
        user_id,
        date,
        vaccine_type,
        String(vaccine_session),
    ];

    let result = await sdk.send(true, 'putCertificate', args); // true: res.send('success');
    console.log(result);
    if (result == 'success') {
        res.status(201).send({});
    } else {
        res.status(400).send({ message: '알 수 없는 오류가 발생했습니다.' });
    }
});

router.get('/vaccine/:vaccineIndex', async (req, res, next) => {
    let {vaccineIndex} = req.params

    let args = [String(vaccineIndex)];
    let result = await sdk.send(false, 'getCertificateByCertKey', args); 
    let resultJSON = JSON.parse(result);
    res.json({
        records: resultJSON,
    });
    /*
    res.json({
        date: '2021-08-16',
        location: '서울아산병원',
        vaccine_type: '화이자',
        vaccine_session: 1,
        user_id: 'bpm1234@gmail.com',
        vaccine_index: 'vc01',
    });
    */
});

router.get('/', async (req, res, next) => {
    let user_id = "test@naver.com"

    let args = [user_id];
    let result = await sdk.send(false, 'getCertificateByUserId', args); 
    let resultJSON = JSON.parse(result);
    res.json({
        records: resultJSON,
    });
});

module.exports = router;
