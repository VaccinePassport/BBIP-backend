const sequelize = require('sequelize');
const verifyJWT = require('../../util/jwt/verifyJWT');
var sdk = require('../../sdk/sdk');

var map = new Map();
const verifyQr = {
    resolveMap: map,
    verifyQr: async (req, res, next) => {
        try {
            let { qrVaccine } = req.params;
            
            const vaccine_index = verifyJWT.verifyQrContent(qrVaccine);

            const vaccine_info = await verifyQr.getVaccineByIndex(vaccine_index.vaccine_index)

            // 푸쉬알림 : 검증 결과 성공
            res.json({
                verified_data: vaccine_info
            });

        } catch (error) {
            console.log(error);
            // 푸쉬알림 : 검증 결과 실패
            res.status(400).json({
                message: '알 수 없는 오류가 발생했습니다.',
            });
            return;
        }
    },
        
   getVaccineByIndex: async(index) => {

        let vaccineList = [];
        for (let vaccineIndex of index) {
            let args = [String(vaccineIndex)];
            let result = await sdk.send(true, 'getCertificateByCertKey', args);
            let resultJSON = JSON.parse(result);
            console.log("json : " + resultJSON[0].vaccineKey)
            vaccineList.push({
                date: resultJSON[0].record.date,
                location: resultJSON[0].record.location,
                vaccine_type: resultJSON[0].record.vaccinetype,
                vaccine_session: parseInt(
                    resultJSON[0].record.vaccinenumber
                ),
                user_id: resultJSON[0].record.userid,
                vaccine_index: resultJSON[0].vaccineKey,
            });
        }

        return vaccineList
   },
     
};

module.exports = verifyQr;
