var sdk = require('../../sdk/sdk');
const { vaccincationSchema } = require('../../util');

module.exports = async (req, res, next) => {
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
}