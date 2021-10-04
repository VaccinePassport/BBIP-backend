const acceptGroupQr = require('./acceptGroupQr');
const groupQr = require('./groupQr');

module.exports = {
    makeGroupQr: groupQr.generateGroupQR,
    acceptGroupQr,
};
