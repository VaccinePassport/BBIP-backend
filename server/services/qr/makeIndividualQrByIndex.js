const signJWT = require('../../util/jwt/signJWT');
var sdk = require('../../sdk/sdk');

const makeIndividualQrByIndex = async (req, res, next) => {
    try {
        const { vaccineIndex } = req.params;
        const { qr_password } = req.body;
        
        const user = res.locals.user;

        if (user.qr_password) {
            if (qr_password != user.qr_password) {
                res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
                return;
            }
        }
        
        const vaccineInfo = await getVaccineByIdx(user.email, vaccineIndex);
        if(!vaccineInfo){
            res.status(400).send({
                message: "접근할 수 없는 백신 이력입니다."
            });
            return;
        } 
        console.log([vaccineInfo]);
        const qr_vaccine = signJWT.makeQrContent([vaccineInfo]);
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
};
    
const getVaccineByIdx = async (email, vaccineIndex) => {
    let args = [String(vaccineIndex)];
    let result = await sdk.send(true, 'getCertificateByCertKey', args);
    let resultJSON = JSON.parse(result);

    if (resultJSON[0].record == '' || (email != resultJSON[0].record.userid)) {
        return undefined;
    } 

    return resultJSON[0].vaccineKey;
}

module.exports = makeIndividualQrByIndex;
