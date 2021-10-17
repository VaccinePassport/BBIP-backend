const { User } = require('../../models');
const { userSchema } = require('../../util');
const signJWT = require('../../util/jwt/signJWT');
const { deleteFollowAndGroup, deleteVaccincation } = require('./deleteUser')

module.exports = async (req, res, next) => {
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

        // Delete existing friends & group
        await deleteFollowAndGroup(user.idx_user);

        // Delete existing information stored on the blockchain
        const resultJSON = await deleteVaccincation(user.idx_user);
        if (resultJSON.message == 'success') {
            const token = signJWT.makeJoinToken(user.idx_user);
            res.status(201).send({
                token,
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};
