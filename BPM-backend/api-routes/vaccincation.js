const express = require('express');
const router = express.Router();
var sdk = require('../sdk');
const { user } = require("../models");
//var ㅁㅁservice = require('../service/ㅁㅁ');


router.post('/', async (req, res, next) => {
    let record = req.body;
    res.status(201).send({
        message: '접종 이력이 등록되었습니다.',
    });
});

// http://54.180.199.56:8080/api/v1/vaccincation/?user_id=h@naver.com&date=2020-01-01&vaccine_type=test&vaccine_session=1
router.get('/', async (req, res, next) => {
    var record = req.query;

    // 값 검사 필요, 중복 처리 필요

    // 이메일, 날짜, 백신종류, 백신차수
    let args = [record.user_id, record.date, record.vaccine_type, record.vaccine_session];
    var result = await sdk.send(true, 'putCertificate', args); // true: res.send('success');

    if(result == 'success'){
        res.status(201).send({});
    }else{
        res.status(400).send({ message: "알 수 없는 오류가 발생했습니다."});
    }
});

router.get('/vaccine/:vaccineIndex', async (req, res, next) => {
    res.json({ 
        date: '2021-08-16',
        location: '서울아산병원',
        vaccine_type: '화이자',
        vaccine_session: 1,
        user_id: 'bpm1234@gmail.com',
        vaccine_index: 'vc01',
    });
});

router.get('/:userId', async (req, res, next) => {
    var { userId } = req.params  //var vaccineIndex = req.params.vaccineIndex;

    let args = [userId];
    var result = await sdk.send(false, 'getCertificateByUserId', args); // false: res.send(result.toString());
    var resultJSON = JSON.parse(result.toString('utf8'));
    var rJ = JSON.parse(result);
    res.json(
        {
            records: rJ
        }
    );
    
    /*
    res.json({
        records: [
            {
                date: '2021-08-16',
                location: '서울아산병원',
                vaccine_type: '화이자',
                vaccine_session: 1,
                user_id: 'bpm1234@gmail.com',
                vaccine_index: 'vc01',
            },
            {
                date: '2021-08-16',
                location: '서울아산병원',
                vaccine_type: '화이자',
                vaccine_session: 2,
                user_id: 'bpm1234@gmail.com',
                vaccine_index: 'vc02',
            },
            {
                date: '2021-08-16',
                location: '서울아산병원',
                vaccine_type: '화이자',
                vaccine_session: 1,
                user_id: 'bpm1234@gmail.com',
                vaccine_index: 'vc01',
            },
        ],
    });*/
});


module.exports = router;
