const express = require('express');
const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { user } = require('../models');
var userService = require('../services/user');

router.get('/dbtest', async (req, res, next) => {
    try {
        const users = await user.findAll();
        res.json(users);
    } catch (error) {
        res.status(400).send({ message: 'DB not Connection' });
    }
});
router.post('/join', async (req, res, next) => {
    var { user_id, phone, name, birth, gender } = req.body;

    // db 처리, 인증코드 생성 이메일 전송

    const token = jwt.sign({ userIdx: 1 }, jwtKey);
    res.send({
        token,
    });
});

router.patch('/auth', authMiddleware, async (req, res, next) => {
    var { code } = req.body;
    const { idx_user, verification_number } = res.locals.user;

    try {
        if (verification_number == code) {
            await user.update({ sign_up_verification: 1 },{
                where: {
                    idx_user: idx_user
                }
            });
    
            res.status(201).send({});
        } else {
            res.status(400).send({ message: '인증코드가 일치하지 않습니다.' });
        }
    } catch (error) {
        res.status(400).send({ message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.' });
    }
});

module.exports = router;
