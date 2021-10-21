const { User } = require('../models');

const deviceTokenService = {
    save: async (req, res, next) => {
        try {
            let { device_token } = req.body;
            const user = res.locals.user;

            await User.update(
                {
                    device_token : device_token
                },
                { where: { user_idx: user.idx_user } }
            );

        } catch (error) {
            console.log(error);
            res.status(400).send({
                message:
                    '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
            });
        }
    },
};

module.exports = deviceTokenService;
