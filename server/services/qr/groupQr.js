const { Group } = require('../../models');
const sequelize = require('sequelize');
const findRealFriendsInFriendList = require('./findRealFriendsInFriendList');
const signJWT = require('../../util/jwt/signJWT')

var map = new Map();
const groupQr = {
    resolveMap: map,
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
            let realFriendsList = await findRealFriendsInFriendList(
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
                    message: 'push 알림에 동의하지 않은 동행자/100m이내 동행인 ~가 있습니다.',
                });
                return;
            }

            await Group.bulkCreate(insertValue);

            // send push
            // pushValue[i].device_token에게 user.email, groupNo을 전송

            // check if friends agree to their personal information
            let pushResult = await groupQr.waitForFriends(groupNo);

            if (pushResult == 'success') {
                // create qr (me+friends)
                const qr_vaccine = signJWT.makeQrContent(['index1', 'index2', 'index3']);
                res.json({
                    qr_vaccine
                });
            } else {
                res.status(400).json({
                    message: '동의하지 않은 동행인이 있습니다.',
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
    waitForFriends: async (groupNo) => {
        try {
            console.log(groupNo, '번 그룹');
            let timerId;
            let promise = new Promise((resolve, reject) => {
                timerId = setTimeout(() => resolve('time out'), 30 * 1000);
                groupQr.resolveMap.set(groupNo, resolve);
            });
            let result = await promise;
            clearTimeout(timerId);
            groupQr.resolveMap.delete(groupNo);
            return result;
        } catch (error) {
            console.log(error);
        }
    }
};

module.exports = groupQr;
