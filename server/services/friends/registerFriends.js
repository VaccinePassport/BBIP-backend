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
        
        //deviceToken에 들어가는 값이 [User객체] 여서 밑처럼 변경했음, 만약 해당 User가 없는 경우/디바이스 토큰이 null 인 경우..는 고려했는지 안했는지 몰라서 그냥 냅뒀어요 확인하시고 주석 지우셔도 됩니다!
        push.pushAlarm([deviceToken[0].get('device_token')], `[BBIP]동행인 등록 요청`, `${friend_id}님이 동행인 등록을 요청하셨습니다. 동의하시나요?`);

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
                await Follow.update(
                    {
                        following_id: followingIdx,
                        followed_id: followedIdx
                    },
                    { where: { 
                        following_id: followedIdx,
                        followed_id: followingIdx
                     } }
                );
        
            } else {
                await Follow.create({
                        following_id: followingIdx,
                        followed_id: followedIdx
                })
            }
        }

    } catch (error) {
        console.log(error);
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
