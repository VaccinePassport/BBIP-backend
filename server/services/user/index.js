const auth = require('./auth');
const authConfirm = require('./authConfirm');
const join = require('./join');
const getQrPwdWhether = require('./getQrPwdWhether');
const setQrPwd = require('./setQrPwd');
const updateUserInfo = require('./updateUserInfo');
const {deleteUserInfo} = require('./deleteUser');

module.exports = {
    auth,
    authConfirm,
    join,
    getQrPwdWhether,
    setQrPwd,
    updateUserInfo,
    deleteUserInfo,
};
