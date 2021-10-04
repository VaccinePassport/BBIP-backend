const { User } = require('../../models');
const { mailSender, userSchema, makeRandomCode } = require('../../util');

module.exports = async (req, res, next) => {
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
}