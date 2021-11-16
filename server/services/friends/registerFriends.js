const { User, Follow } = require('../../models');
const { friendsSchema } = require('../../util');
const admin = require('firebase-admin')
const { push } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { friend_id } = req.body;
        const user = res.locals.user;

        const friend = await User.findAll({
            where: {
                email: friend_id,
            },
            attributes: ['idx_user']
        });

        await registerFriends(user.idx_user, friend[0].get('idx_user'));
        deviceToken = await findFriendDeviceToken(friend_id)

        push.push(deviceToken, `[BBIP]동행인 등록 요청`, `${friend_id}님이 동행인 등록을 요청하셨습니다. 동의하시나요?`);

        res.status(200).json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};

const registerFriends = async (followingIdx, followedIdx) => {
    try {

        const exFollow = await Follow.findAll({
            where: {
                following_id: followingIdx,
                followed_id: followedIdx,
            },
        });

        if (exFollow[0]) {
            console.log('이미 존재하는 동행인');
        } else {

            const exFollow2 = await Follow.findAll({
                where: {
                    following_id: followedIdx,
                    followed_id: followingIdx
                },
            });

            if (exFollow2[0]) {
                console.log('이미 존재하는 동행인');
            } else {
                await Follow.Create({
                        following_id: followingIdx,
                        followed_id: followedIdx
                })
            }
        }

        // await Follow.findOrCreate({
        //     following_id :followingIdx,
        //     followed_id : followedIdx
        //  })
        //  .spread((user, created) => {
        //      if (created) {
        //         console.log('follow : ', user);
        //      } else {
        //         console.log('이미 존재하는 동행인');
        //      }
        //  })
    } catch (error) {
        return undefined;
    }
};

const findFriendDeviceToken = async (deviceToken) => {
    try {
        return await User.findAll({
            where: {
                email: deviceToken,
            },
            attributes: ['device_token']
        });

    } catch (error) {
        return undefined;
    }
}
