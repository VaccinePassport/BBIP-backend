const express = require('express');
const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');
const { authMiddleware } = require('../middlewares');
const { User } = require('../models');
const {
    userService,
    mailSender,
    userSchema,
    makeRandomCode,
} = require('../services');

const router = express.Router();

router.post('/join', async (req, res, next) => {
    try {
        let { user_id, phone, name, birth, gender } =
            await userSchema.postJoinSchema.validateAsync(req.body);

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

        const code = makeRandomCode(6);

        const user = await User.create({
            email: user_id,
            phone: phone,
            name: name,
            birth: birth,
            gender: gender,
            verification_number: code,
        });

        mailSender.sendGmail({ user_id, name, code });

        const token = jwt.sign({ userIdx: user.idx_user }, jwtKey);
        res.status(201).send({
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '요청한 데이터의 형식이 올바르지 않습니다.',
        });
    }
});

router.patch('/auth', authMiddleware, async (req, res, next) => {
    try {
        let { code } = await userSchema.patchAuthSchema.validateAsync(req.body);
        const { idx_user, verification_number } = res.locals.user;

        try {
            if (verification_number == code) {
                await User.update(
                    { sign_up_verification: 1 },
                    {
                        where: {
                            idx_user: idx_user,
                        },
                    }
                );

                res.status(201).send({});
            } else {
                res.status(400).send({
                    message: '인증코드가 일치하지 않습니다.',
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({
                message:
                    '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '요청한 데이터의 형식이 올바르지 않습니다.',
        });
    }
});

module.exports = router;
