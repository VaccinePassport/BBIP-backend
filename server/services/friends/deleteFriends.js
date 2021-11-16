const { User, Follow } = require('../../models');
const { userSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        const { friendId } = req.params
        const user = res.locals.user;

        const followedIdx = await User.findAll({
            attributes: ['idx_user'],
            where: {
                email: friendId
            },
        })

        const exFollow = await Follow.findAll({
            where: {
                following_id: user.idx_user,
                followed_id: followedIdx[0].get('idx_user')
            },
        });

        if (exFollow) {
            await Follow.destroy({
                where: {
                    following_id: user.idx_user,
                    followed_id: followedIdx[0].get('idx_user')
                },
            });
        } else {
            await Follow.destroy({
                where: {
                    following_id: followedIdx[0].get('idx_user'),
                    followed_id: user.idx_user
                },
            });
        }
        // await Follow.destroy({
        //     where: {
        //         following_id: user.idx_user,
        //         followed_id: followedIdx[0].get('idx_user')
        //     },
        // });
        res.json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};