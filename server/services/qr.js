const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');
const { User, Follow, Group } = require('../models');
const sequelize = require('sequelize');

const qrService = {
    generateQroupQR: async (req, res, next) => {
        let { user_id_list, qr_password } = req.body;
        const user = res.locals.user;

        // check qr password
        if (user.qr_password) {
            if (qr_password != user.qr_password) {
                res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
                return;
            }
        }

        try {
            // check if user_id_list is a valid friend list
            let realFriendsList = await qrService.findRealFriendsInFriendList(
                user.idx_user,
                user_id_list
            );
            if (realFriendsList.length != user_id_list.length) {
                res.status(400).json({
                    message: '동행자가 아닌 사용자가 포함되어 있습니다.',
                });
                return;
            }

            // insert Group
            const beforeGroupNo = await Group.findAll({
                attributes: [
                    [
                        sequelize.fn(
                            'IFNULL',
                            sequelize.fn('MAX', sequelize.col('group_no')),
                            0
                        ),
                        'before_group_no',
                    ],
                ],
            });
            const groupNo = beforeGroupNo[0].get('before_group_no') + 1;

            let insertValue = [];
            let pushValue = [];
            for (friend of realFriendsList) {
                insertValue.push({
                    group_no: groupNo,
                    idx_follow: friend.idx_follow,
                });
                pushValue.push({
                    idx_follow: friend.idx_follow,
                    device_token: friend.User_followed_id.device_token,
                });
            }

            if (pushValue.length != user_id_list.length) {
                res.status(400).json({
                    message: 'push 알림에 동의하지 않은 동행자가 있습니다.',
                });
                return;
            }

            await Group.bulkCreate(insertValue);

            // send push
            // pushValue[i].device_token에게 user.email, groupNo을 전송

            // check if friends agree to their personal information
            qrService.checkPersonalInformation(insertValue);

            // create qr (me+friends)

            res.json({
                qr_vaccine: pushValue,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: '알 수 없는 오류가 발생했습니다.',
            });
            return;
        }
    },
    findFriends: async (idx_user) => {
        try {
            /* idx_user와 친구인 [follow row & follow_idx에 해당하는 email] 찾기
            SELECT *, 
            (SELECT email FROM user where followed_id=idx_user) as followed_email
            FROM bbip.follow
            WHERE following_id = idx_user AND accept = 1;
            */
            const friends = await Follow.findAll({
                attributes: {
                    include: [
                        [
                            sequelize.literal(
                                `(SELECT email FROM user where followed_id=idx_user)`
                            ),
                            'followed_email',
                        ],
                    ],
                },
                where: {
                    following_id: idx_user,
                    accept: 1,
                },
            });
            return friends;
        } catch (error) {
            return [];
        }
    },
    findRealFriendsInFriendList: async (idx_user, friend_list) => {
        try {
            /* (friend_list) 중에 idx_user와 친구인 [follow row & follow_idx에 해당하는 email] 찾기
            SELECT Follow.idx_follow, Follow.following_id, Follow.followed_id, Follow.bookmark, Follow.accept, 
                user.email AS followed_email
            FROM follow AS Follow
            LEFT OUTER JOIN user AS user
                ON Follow.followed_id = user.idx_user
            WHERE Follow.following_id = 13 AND Follow.accept = 1 AND user.email IN ('','');
            */
            const friends = await Follow.findAll({
                where: {
                    following_id: idx_user,
                    accept: 1,
                },
                include: [
                    {
                        model: User,
                        as: 'User_followed_id',
                        required: true,
                        attributes: ['email', 'device_token'],
                        where: {
                            email: friend_list,
                        },
                    },
                ],
            });
            return friends;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
    checkPersonalInformation: async (group_no_idx_follow_list) => {
        // 1분 안에 모든 이들이 동의 true
        // 1분 지나면(모든 이들이 동의하지 않으면) false
    }
};

module.exports = qrService;
