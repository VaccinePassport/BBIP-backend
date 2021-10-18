const { User } = require('../../models');
const { userSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { phone, name, birth, gender } = await userSchema.patchUser.validateAsync(req.body);
        const user = res.locals.user;

        await User.update(
            {
                phone: phone,
                name: name,
                birth: birth,
                gender: gender,
            },
            { where: { idx_user: user.idx_user } }
        );
        
        res.status(201).send({});
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};
