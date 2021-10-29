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
            const vaccine_info = await verifyQr.getVaccineByIndex(vaccine_index);
            console.log(vaccine_info)
            res.json({
                verified_data: vaccine_info
            });

        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: '알 수 없는 오류가 발생했습니다.',
            });
            return;
        }
    },
        
   getVaccineByIndex: async(index) => {
        let args = [String(index)];
        let result = await sdk.send(true, 'getCertificateByCertKeys', args);
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

module.exports = verifyQr;
