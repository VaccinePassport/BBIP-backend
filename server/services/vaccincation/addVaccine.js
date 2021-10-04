var sdk = require('../../sdk/sdk');
const { vaccincationSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { date, location, vaccine_type, vaccine_session } =
            await vaccincationSchema.postVaccine.validateAsync(req.body);

        const { email } = res.locals.user;

        let args = [
            email,
            date,
            vaccine_type,
            String(vaccine_session),
            location,
        ];

        let result = await sdk.send(false, 'putCertificate', args);
        let resultJSON = JSON.parse(result);
       
        if (resultJSON.message == 'success') {
            res.status(201).send({});
        } else if (resultJSON.message == 'already exists'){
            res.status(400).send({
                message: '동일한 차수의 백신 내역이 존재합니다.',
            });
        }
        else{
            res.status(400).send({
                message: '알 수 없는 오류가 발생했습니다.',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '요청한 데이터의 형식이 올바르지 않습니다.',
        });
    }
}