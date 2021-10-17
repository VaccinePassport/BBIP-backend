const { User } = require('../../models');

module.exports = async (req, res, next) => {
    try {
        let { is_qr_password, qr_password } = req.body;
        const user = res.locals.user;

        qr_password = !is_qr_password ? null : qr_password;
        const updateUser = await setQrPwd(user.idx_user, qr_password);
        if (!updateUser) {
            throw new Error('set qr_password - error');
        }
        res.status(201).json({});
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};

const setQrPwd = async (userIdx, qrPwd) => {
    try {
        const user = await User.update(
            {
                qr_password: qrPwd,
            },
            { where: { idx_user: userIdx } }
        );
        return user;
    } catch (error) {
        return undefined;
    }
};
