const { User, Follow } = require('../../models');
const { friendsSchema } = require('../../util');
const admin = require('firebase-admin')
const { push } = require('../../util');
const Op = require('sequelize').Op;

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
        if (deviceToken[0]) {
            push.pushAlarm([deviceToken[0].get('device_token')], `[BBIP]동행인 등록 요청`, `${friend_id}님이 동행인 등록을 요청하셨습니다. 동의하시나요?`);
        } else {
            throw new Error('디바이스 토큰이 존재하지 않습니다.');
        }

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
            //-1 -> 0으로 update하기
            if (exFollow[0].get('accept') == -1) {
                await Follow.update(
                    {
                        accept: 0
                    },
                    {
                        where: {
                            following_id: followingIdx,
                            followed_id: followedIdx
                        }
                    }
                );
            }
        } else {
            const exFollow2 = await Follow.findAll({
                where: {
                    following_id: followedIdx,
                    followed_id: followingIdx
                },
            });

            if (exFollow2[0]) {
                console.log('이미 존재하는 동행인');
                // -1 -> 0으로 update
                if (exFollow[0].get('accept') == -1) {
                    await Follow.update(
                        {
                            accept: 0,
                            following_id: followingIdx,
                            followed_id: followedIdx
                        },
                        {
                            where: {
                                following_id: followingIdx,
                                followed_id: followedIdx
                            }
                        }
                    );
                } else {
                    await Follow.update(
                        {
                            following_id: followingIdx,
                            followed_id: followedIdx
                        },
                        {
                            where: {
                                following_id: followedIdx,
                                followed_id: followingIdx
                            }
                        }
                    );
                }

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

const findFriendDeviceToken = async (email) => {
    try {
        return await User.findAll({
            where: {
                email: email,
                name: { [Op.ne]: null },
                device_token: { [Op.ne]: null }
            },
            attributes: ['device_token']
        });

    } catch (error) {
        return undefined;
    }
}
