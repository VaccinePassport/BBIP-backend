const { User } = require('../../models');
const { userSchema } = require('../../util');
const signJWT = require('../../util/jwt/signJWT');

module.exports = async (req, res, next) => {
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
                signJWT
                const token = signJWT.makeEmailToken(user.idx_user);
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
}