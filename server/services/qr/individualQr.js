const sequelize = require('sequelize');
const signJWT = require('../../util/jwt/signJWT');
var sdk = require('../../sdk/sdk');
const { qrSchema } = require('../../util');

var map = new Map();
const individualQr = {
    resolveMap: map,
    generateIndividualQr: async (req, res, next) => {
        try {
            const { qr_password } = req.body;
            const user = res.locals.user;

            if (user.qr_password) {
                if (qr_password != user.qr_password) {
                    res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
                    return;
                }
            }
            
            const vaccine_info = await individualQr.getVaccineByEmail(user.email);
            const qr_vaccine = signJWT.makeQrContent(vaccine_info);
            res.json({
                qr_vaccine,
            });

        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: '유효하지 않은 정보입니다.',
            });
            return;
        }
    },
        
    getVaccineByEmail: async (email) => {
        let args = email;
        let result = await sdk.send(true, 'getCertificateByUserId', args);
        let resultJSON = JSON.parse(result);

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
        return Array.from(vaccineSet);
    },
};

module.exports = individualQr;
