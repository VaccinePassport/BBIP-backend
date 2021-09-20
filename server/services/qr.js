const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');

const qrService = {
    group: async (req, res, next) => {
        let { user_id, qr_password } = req.body;
        
        // qr_password가 있는 경우 , 틀린 경우

        // user들의 갠정보 동의 여부

        // 내 qr 내용

        // user들의 qr 내용
        
        res.json({
            message: test
        });
    },
};

module.exports = qrService;
