const acceptGroupQr = require('./acceptGroupQr');
const groupQr = require('./groupQr');
const individualQr = require('./individualQr');
const verifyQr = require('./verifyQr');

module.exports = {
    makeGroupQr: groupQr.generateGroupQR,
    makeIndividualQr: individualQr.generateIndividualQr,
    acceptGroupQr,
    verifyQr,
};