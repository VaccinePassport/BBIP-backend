const express = require('express');
const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { User } = require('../models');
const userService = require('../services/user');

router.get('/dbtest', async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(400).send({ message: 'DB not Connection' });
    }
});

router.post('/join', async (req, res, next) => {
    let { user_id, phone, name, birth, gender } = req.body;

    const existUsers = await User.findAll({
        where: {
            email: user_id,
        },
    });
    
    if (existUsers.length) {
        res.status(400).send({
            message: '이미 가입된 이메일 입니다.',
        });
        return;
    }

    // 인증코드 생성
    let code = 'TEst12';

    const user = await User.create({
        email: user_id,
        phone: phone,
        name: name,
        birth: birth,
        gender: gender,
        verification_number: code,
    });

    // 이메일 전송

    const token = jwt.sign({ userIdx: user.idx_user }, jwtKey);
    res.status(201).send({
        token,
    });
});

router.patch('/auth', authMiddleware, async (req, res, next) => {
    let { code } = req.body;
    const { idx_user, verification_number } = res.locals.user;

    try {
        if (verification_number == code) {
            await user.update(
                { sign_up_verification: 1 },
                {
                    where: {
                        idx_user: idx_user,
                    },
                }
            );

            res.status(201).send({});
        } else {
            res.status(400).send({ message: '인증코드가 일치하지 않습니다.' });
        }
    } catch (error) {
        res.status(400).send({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
});

module.exports = router;
