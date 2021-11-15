const sequelize = require('sequelize');
const verifyJWT = require('../../util/jwt/verifyJWT');
const { push } = require('../../util');
var sdk = require('../../sdk/sdk');

var map = new Map();
const verifyQr = {
    resolveMap: map,
    verifyQr: async (req, res, next) => {
        try {
            let { qrVaccine } = req.params;
            const userIdx = res.locals.user.idx_user;
            const deviceToken = verifyQr.findDeviceToken(userIdx)

            const vaccine_index = verifyJWT.verifyQrContent(qrVaccine);

            const vaccine_info = await verifyQr.getVaccineByIndex(vaccine_index.vaccine_index)

            // 푸쉬알림 : 검증 결과 성공
            push.push(deviceToken, `[BBIP]QR 검증 완료`, `QR 검증이 성공하였습니다.`);

            res.json({
                verified_data: vaccine_info
            });

        } catch (error) {
            console.log(error);
            // 푸쉬알림 : 검증 결과 실패
            push.push(deviceToken, `[BBIP]QR 검증 실패`, `QR 검증이 실패하였습니다.`);
            res.status(400).json({
                message: '알 수 없는 오류가 발생했습니다.',
            });
            return;
        }
    },

    getVaccineByIndex: async (index) => {

        let vaccineList = [];
        for (let vaccineIndex of index) {
            let args = [String(vaccineIndex)];
            let result = await sdk.send(true, 'getCertificateByCertKey', args);
            let resultJSON = JSON.parse(result);
            console.log("json : " + resultJSON[0].vaccineKey)
            console.log(resultJSON[0])
            const user = await verifyQr.findUserNameAndBirth(resultJSON[0].record.userid)
            console.log("user: " , user)
            vaccineList.push({
                date: resultJSON[0].record.date,
                location: resultJSON[0].record.location,
                vaccine_type: resultJSON[0].record.vaccinetype,
                vaccine_session: parseInt(
                    resultJSON[0].record.vaccinenumber
                ),
                user_id: resultJSON[0].record.userid,
                user_name: user[0].get('name'),
                user_birth: user[0].get('birth')
            });
        }

        return vaccineList
    },

    findUserNameAndBirth: async (email) => {
        try {
            return await User.findAll({
                where: { email: email },
                attributes: ['name','birth']
            });

        } catch (error) {
            return undefined;
        }
    },

    findDeviceToken: async (userIdx) => {
        try {
            return await User.findAll({
                where: { idx_user: userIdx },
                attributes: ['device_token']
            });

        } catch (error) {
            return undefined;
        }
    },

};

module.exports = verifyQr;
