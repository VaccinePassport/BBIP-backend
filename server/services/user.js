const jwt = require('jsonwebtoken');
const { jwtEmailKey, jwtJoinKey } = require('../config/config');
const { User } = require('../models');
const { mailSender, userSchema, makeRandomCode } = require('../util');
var sdk = require('../sdk/sdk');

const userService = {
    auth: async (req, res, next) => {
        try {
            let { email } = await userSchema.postAuth.validateAsync(req.body);
            const code = makeRandomCode(6);

            const user = await User.findOne({
                where: { email },
            });
            if (user) {
                await User.update(
                    { verification_number: code },
                    {
                        where: { idx_user: user.idx_user },
                    }
                );
            } else {
                await User.create({
                    email,
                    verification_number: code,
                });
            }

            mailSender.sendGmail({ email, code });
            res.send({});
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: '알 수 없는 에러가 발생했습니다.',
            });
        }
    },

    authComfirm: async (req, res, next) => {
        try {
            let { email, code } = await userSchema.postAuthConfirm.validateAsync(req.body);
            
            try {
                const user = await User.findOne({
                    where: {
                        email,
                    },
                });

                if (!user) {
                    res.status(401).json({
                        message: '존재하지 않는 이메일입니다.',
                    });
                    return;
                }

                if (user.verification_number == code) {
                    const token = jwt.sign(
                        { userIdx: user.idx_user },
                        jwtEmailKey,
                        {
                            expiresIn: '1h',
                        }
                    );
                    res.status(201).send({ token });
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

    join: async (req, res, next) => {
        try {
            let { user_id, phone, name, birth, gender } =
                await userSchema.putJoin.validateAsync(req.body);
            const user = res.locals.user;
          
            if (user.email != user_id) {
                res.status(400).send({
                    message: '인증된 이메일과 일치하지 않습니다.',
                });
                return;
            }

            await User.update(
                {
                    phone: phone,
                    name: name,
                    birth: birth,
                    gender: gender,
                },
                { where: { email: user_id } }
            );

            // Delete existing information stored on the blockchain
            let args = [user_id];
            let result = await sdk.send(
                false,
                'deleteCertificateByUserId',
                args
            );
            let resultJSON = JSON.parse(result);
            if (resultJSON.message == 'success') {
                const token = jwt.sign({ userIdx: user.idx_user }, jwtJoinKey);
                res.status(201).send({
                    token,
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({
                message:
                    '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
            });
        }
    },
};

module.exports = userService;
