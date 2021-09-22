const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');
const { User, Follow } = require('../models');
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
        friends_list[i].get('followed_email')

        // 친구들의 개인 정보 동의 여부 확인

        // qr 내용 생성 (내 정보+친구들 정보 생성)

        res.json({
            qr_vaccine: 'test',
        });
    },
    findRealFriendsInFriendList: async (idx_user, friend_list) => {
        try {
            /*
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
};

module.exports = qrService;
