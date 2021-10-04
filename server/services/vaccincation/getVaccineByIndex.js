var sdk = require('../../sdk/sdk');
const { vaccincationSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { vaccineIndex } =
            await vaccincationSchema.getVaccineByIdx.validateAsync(
                req.params
            );

        const { email } = res.locals.user;

        let args = [String(vaccineIndex)];

        let result = await sdk.send(true, 'getCertificateByCertKey', args);
        let resultJSON = JSON.parse(result);

        if (resultJSON[0].record == '') {
            res.send({});
        } else if(email != resultJSON[0].record.userid){
            res.status(400).send({
                message: "접근할 수 없는 백신 이력입니다."
            })
        } 
        else {
            res.send({
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
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '요청한 데이터의 형식이 올바르지 않습니다.',
        });
    }
}