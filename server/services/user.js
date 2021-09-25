const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');
const { User } = require('../models');
const { mailSender, userSchema, makeRandomCode } = require('../util');

const userService = {
    join: async (req, res, next) => {
        try {
            let { user_id, phone, name, birth, gender } =
                await userSchema.postJoin.validateAsync(req.body);

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

            const user = await User.create({
                email: user_id,
                phone: phone,
                name: name,
                birth: birth,
                gender: gender,
            });

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
    },

    auth: async (req, res, next) => {
        const { idx_user, email, name } = res.locals.user;

        try {
            const code = makeRandomCode(6);

            await User.update(
                { verification_number: code },
                {
                    where: {
                        idx_user: idx_user,
                    },
                }
            );

            mailSender.sendGmail({ email, name, code });
            res.status(201).send({});
        } catch (error) {
            console.log(error);
            res.status(400).send({
                message: '알 수 없는 에러가 발생했습니다..',
            });
        }
    },

    authComfirm: async (req, res, next) => {
        try {
            let { code } = await userSchema.patchAuth.validateAsync(req.body);
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
    },
};

module.exports = userService;
