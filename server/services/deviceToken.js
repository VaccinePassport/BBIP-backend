const deviceTokenService = {
    save: async (req, res, next) => {
        try {
            let { user_id, deviceToken } =
                await userSchema.putJoin.validateAsync(req.body);
            const user = res.locals.user;
          
            // user id 존재하지 않는 경우 check
            const exUser = await User.findOne({ where: { user_id } })
            if (!exUser) {
                res.status(400).send({
                    message: '유저가 존재하지 않습니다.',
                });
                return;
            }


            await User.update(
                {
                    device_token : deviceToken
                },
                { where: { userIdx: user_id } }
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
