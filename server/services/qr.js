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
            // some이면 프렌드만, every면 프렌드 아닌 사람만
            const friends_list = await qrService.findFriends(user.idx_user);
            const friends_list2 = await qrService.findRealFriendsInFriendList(
                user.idx_user,
                user_id_list
            );
            res.send(friends_list2);
            return;

            let notFriends = user_id_list.filter((user_id) =>
                friends_list.every(
                    (value) => user_id != value.get('followed_email')
                )
            );
            if (notFriends.length != 0) {
                res.status(400).json({ message: '잘못된 친구 정보입니다.' });
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
        friends_list[i].get('followed_email');

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
            console.log("**********");
            /* (friend_list) 중에 idx_user와 친구인 [follow row & follow_idx에 해당하는 email] 찾기
            SELECT follow_include_following_email.*, follow_include_followed_email.followed_email
            FROM (SELECT follow.*, email as following_email
                    FROM bbip.follow INNER JOIN user on following_id=idx_user) as follow_include_following_email
            INNER JOIN (SELECT follow.*, email as followed_email
                    FROM bbip.follow INNER JOIN user on followed_id=idx_user) as follow_include_followed_email
            ON (follow_include_following_email.idx_follow = follow_include_followed_email.idx_follow)
            WHERE follow_include_following_email.following_id = idx_user 
                AND follow_include_following_email.accept = 1 
                AND followed_email in ("friend_email1@naver.com", "friend_email2@naver.com");
            */
            const friends = await Follow.findAll({
                where: {
                    following_id: idx_user,
                    accept: 1,
                },
                include: [
                    {
                        model: User,
                        as : 'user_of_followed_id'
                    },
                    {
                        model: User,
                        as : 'user_of_following_id'
                    }
                ],
            });
            console.log("*************");
            console.log("*", friends);
            return friends;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
};

module.exports = qrService;
