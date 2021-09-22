const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');
const { User, Follow, Group } = require('../models');
const sequelize = require('sequelize');

const qrService = {
    generateQroupQR: async (req, res, next) => {
        let { user_id_list, qr_password } = req.body;
        const user = res.locals.user;

        // QR 비번 확인
        if (user.qr_password) {
            if (qr_password != user.qr_password) {
                res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
                return;
            }
        }

        // 친구 정보 확인
        try {
            const real_friends_list = await qrService.findRealFriendsInFriendList(
                user.idx_user,
                user_id_list
            );
            if (real_friends_list.length != user_id_list.length) {
                res.status(400).json({ message: '동행자가 아닌 사용자가 포함되어 있습니다.' });
                return;
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: '알 수 없는 오류가 발생했습니다.',
            });
            return;
        }

        // 친구들에게 개인 정보 push 알림 전송

        // group table (누가 누구에게 그룹 qr 요청을 했는지)
        //real_friends_list

        // 친구들의 개인 정보 동의 여부 확인

        // qr 내용 생성 (내 정보+친구들 정보 생성)

        res.json({
            qr_vaccine: 'test',
        });
    },
    findFriends: async (idx_user) => {
        try {
            /* idx_user와 친구인 [follow row & follow_idx에 해당하는 email] 찾기
            SELECT *, 
            (SELECT email FROM user where followed_id=idx_user) as followed_email
            FROM bbip.follow
            WHERE following_id = idx_user AND accept = 1;
            */
            /*
           attributes: {
                    include: []
                },
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
                        as : 'User_followed_id',
                        required: true, //INNER JOIN
                        attributes: ['email'],
                        where: {
                            email: friend_list
                        }
                    },
                ],
            });
            return friends;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
};

module.exports = qrService;
