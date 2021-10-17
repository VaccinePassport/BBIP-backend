const { User } = require('../../models');

module.exports = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const qrPwd = await getQrPwd(user.idx_user);
        console.log(qrPwd);
        const hasQrPwd = (!qrPwd || qrPwd=="") ? false : true;
        res.json({has_qr_password:hasQrPwd})
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};

const getQrPwd = async (userIdx) => {
    const user = await User.findOne({
        attributes: ['qr_password'],
        where: {
            idx_user: userIdx
        }
    });
    return user.get('qr_password');
}