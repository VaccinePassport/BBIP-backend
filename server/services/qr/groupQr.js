const { Group } = require('../../models');
const sequelize = require('sequelize');
const findRealFriendsInFriendList = require('./findRealFriendsInFriendList');
const signJWT = require('../../util/jwt/signJWT');
var sdk = require('../../sdk/sdk');
const { qrSchema } = require('../../util');

var map = new Map();
const groupQr = {
    resolveMap: map,
    generateGroupQR: async (req, res, next) => {
        try {
            let { user_id_list, qr_password, latitude, longitude } =
                await qrSchema.postGroup.validateAsync(req.body);
            const user = res.locals.user;

            // check qr password
            if (user.qr_password) {
                if (qr_password != user.qr_password) {
                    res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
                    return;
                }
            }
            
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
                    latitude,
                    longitude,
                });
                pushValue.push({
                    idx_follow: friend.idx_follow,
                    device_token: friend.User_followed_id.device_token,
                });
            }

            if (pushValue.length != user_id_list.length) {
                res.status(400).json({
                    message: 'push 알림 설정을 하지 않은 동행자가 있습니다.',
                });
                return;
            }

            await Group.bulkCreate(insertValue);

            // send push
            // pushValue[i].device_token에게 user.email, groupNo을 포함한 메시지를 전송

            // check if friends agree to their personal information
            let pushResult = await groupQr.waitForFriends(groupNo);

            if (pushResult == 'success') {
                user_id_list.unshift(user.email);
                const vaccine_list = await groupQr.getVaccineByEmails(
                    user_id_list
                );
                const qr_vaccine = signJWT.makeQrContent(vaccine_list);
                res.json({
                    qr_vaccine,
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
    },
    getVaccineByEmails: async (emailList) => {
        let args = emailList;
        let result = await sdk.send(true, 'getCertificateByUserIds', args);
        let resultJSON = JSON.parse(result);
        //console.log(resultJSON);

        let vaccineSet = new Set();
        let vaccineMap = new Map();
        for (let vaccine of resultJSON) {
            let storedValueInMap = vaccineMap.get(vaccine.record.userid);

            if (!storedValueInMap) {
                vaccineMap.set(vaccine.record.userid, {
                    vaccine_index: vaccine.vaccineKey,
                    vaccine_session: parseInt(vaccine.record.vaccinenumber),
                });
                vaccineSet.add(vaccine.vaccineKey);
            } else {
                if (
                    storedValueInMap.vaccine_session <
                    parseInt(vaccine.record.vaccinenumber)
                ) {
                    vaccineSet.delete(storedValueInMap.vaccine_index);
                    vaccineMap.set(vaccine.record.userid, {
                        vaccine_index: vaccine.vaccineKey,
                        vaccine_session: parseInt(vaccine.record.vaccinenumber),
                    });
                    vaccineSet.add(vaccine.vaccineKey);
                }
            }
        }
        //console.log(vaccineSet);
        return Array.from(vaccineSet);
    },
};

module.exports = groupQr;
