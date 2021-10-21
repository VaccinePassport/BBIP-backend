const acceptGroupQr = require('./acceptGroupQr');
const groupQr = require('./groupQr');
const individualQr = require('./individualQr')

module.exports = {
    makeGroupQr: groupQr.generateGroupQR,
    makeIndividualQr: individualQr.generateIndividualQr,
    acceptGroupQr,
};
