const jwt = require('jsonwebtoken');
const { jwtQRKey } = require('../config/config');
const { User, Follow, Group } = require('../models');
const sequelize = require('sequelize');

const qrService = {
    generateGroupQR: async (req, res, next) => {
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
            //let result = await qrService.checkPersonalInformation(req, res, insertValue);
            let pushResult = await qrService.checkPersonalInformation(
                insertValue
            );
            if (pushResult == 'success') {
                // create qr (me+friends)
                // 안에 넣을 정보 뭐인지 슬랙에서 확인
                const qr_vaccine = jwt.sign(
                    // 0번 인덱스는 무조건 내꺼 or email
                    { vaccine_index: ['index1', 'index2', 'index3'] },
                    jwtQRKey,
                    {
                        expiresIn: '60s',
                    }
                );
                res.json({
                    qr_vaccine,
                    pushResult, //확인용
                });
            } else {
                res.status(400).json({
                    message: '동의하지 않은 동행인이 있습니다.',
                    pushResult, //확인용
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: '알 수 없는 오류가 발생했습니다.',
            });
            return;
        }
    },
    // idx_user와 친구인 [follow row & follow_idx에 해당하는 email] 찾기
    findFriends: async (idx_user) => {
        try {
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
    // (friend_list) 중에 idx_user와 친구인 [follow row & follow_idx에 해당하는 email] 찾기
    findRealFriendsInFriendList: async (idx_user, friend_list) => {
        try {
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
        try {
            const start = new Date();
            let timerId;
            let promise = new Promise((resolve, reject) => {
                timerId = setInterval(async () => {
                    let now = new Date();
                    if (now - start > 30 * 1000) {
                        // 1분 지나면(모든 이들이 동의하지 않으면) => timeout
                        resolve('timeout');
                    }
                    // db에서 get하는거
                    let group = await Group.findOne({
                        where: {
                            group_no: group_no_idx_follow_list[0].group_no,
                        },
                        attributes: [
                            [
                                sequelize.literal(
                                    'count(CASE WHEN accept=1 THEN 1 END)'
                                ),
                                'acceptFriends',
                            ],
                            [
                                sequelize.literal(
                                    'count(CASE WHEN accept=-1 THEN 1 END)'
                                ),
                                'rejectFriends',
                            ],
                        ],
                    });
                    // console.log(group_no_idx_follow_list[0].group_no, group.get('acceptFriends'), group.get('rejectFriends'));
                    if (
                        group.get('acceptFriends') ==
                        group_no_idx_follow_list.length
                    ) {
                        // 다른 사람들도 정보 완료 시 resolve
                        resolve('success');
                    } else if (group.get('rejectFriends') > 0) {
                        // 1명이라도 거절 => fail
                        resolve('fail');
                    }
                }, 1 * 1000);
            });

            let result = await promise;
            clearInterval(timerId);
            return result;
        } catch (error) {
            console.log(error);
            return 'fail';
        }
    },
    checkPersonalInformation2: async (req, res, group_no_idx_follow_list) => {
        try {
            
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = qrService;
