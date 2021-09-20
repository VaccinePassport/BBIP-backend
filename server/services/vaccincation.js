var sdk = require('../sdk');
const { vaccincationSchema } = require('../util');

const vaccincationService = {
    addVaccine: async (req, res, next) => {
        try {
            let { date, location, vaccine_type, vaccine_session } =
                await vaccincationSchema.postVaccine.validateAsync(req.body);

            let user_id = 'test@naver.com';
            // const { user_id } = res.locals.user;

            let args = [
                user_id,
                date,
                vaccine_type,
                String(vaccine_session),
                location,
            ];

            let result = await sdk.send(true, 'putCertificate', args);
            console.log();
            console.log(result.endorsements[0].Error)
            console.log();
            console.log(result.endorsements[0].status)
            console.log();
            console.log(result.endorsements[0].payload)
            if (result == 'success') {
                res.status(201).send({});
            } else {
                res.status(400).send({
                    message: '알 수 없는 오류가 발생했습니다.',
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({
                message: '잘못된 요청입니다.',
            });
        }
    },

    getVaccineByEmail: async (req, res, next) => {
        let user_id = 'test@naver.com';
        // const { email } = res.locals.user;

        let args = [user_id];
        let result = await sdk.send(false, 'getCertificateByUserId', args);
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

            // const { email } = res.locals.user;

            let args = [String(vaccineIndex)];

            let result = await sdk.send(false, 'getCertificateByCertKey', args);
            let resultJSON = JSON.parse(result);

            /*
            if(email != resultJSON[0].record.userid){
                res.status(400).send({
                    message: "잘못된 요청입니다."
                })
            }
            */

            if (resultJSON[0].record == '') {
                res.send({});
            } else {
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
                message: '잘못된 요청입니다.',
            });
        }
    },
};

module.exports = vaccincationService;
