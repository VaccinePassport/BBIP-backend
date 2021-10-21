const acceptGroupQr = require('./acceptGroupQr');
const groupQr = require('./groupQr');
const individualQr = require('./individualQr');
const verifyQr = require('./verifyQr');
const makeIndividualQrByIndex = require('./makeIndividualQrByIndex');

module.exports = {
    makeGroupQr: groupQr.generateGroupQR,
    makeIndividualQr: individualQr.generateIndividualQr,
    makeIndividualQrByIndex: makeIndividualQrByIndex,
    acceptGroupQr,
    verifyQr: verifyQr.verifyQr,
};