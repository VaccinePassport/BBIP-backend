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
            console.log(vaccine_index.vaccine_index)
            const vaccine_info = await verifyQr.getVaccineByIndex(vaccine_index.vaccine_index)

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

        return resultJSON
   },
     
};

module.exports = verifyQr;
