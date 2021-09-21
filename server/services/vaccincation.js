var sdk = require('../sdk/sdk');
const { vaccincationSchema } = require('../util');

const vaccincationService = {
    addVaccine: async (req, res, next) => {
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
    },

    getVaccineByEmail: async (req, res, next) => {
        const { email } = res.locals.user;

        let args = [email];
        let result = await sdk.send(true, 'getCertificateByUserId', args);
        let resultJSON = JSON.parse(result);

        let vaccineList = [];
        for (let vaccine of resultJSON) {
            vaccineList.push({
                date: vaccine.record.date,
                location: vaccine.record.location,
                vaccine_type: vaccine.record.vaccinetype,
                vaccine_session: parseInt(vaccine.record.vaccinenumber),
                user_id: vaccine.record.userid,
                vaccine_index: vaccine.vaccineKey,
            });
        }
        res.send({ records: vaccineList });
    },

    getVaccineByIndex: async (req, res, next) => {
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
    },
};

module.exports = vaccincationService;
