const mailSender = require('./nodemailer/mailSender');
const userSchema = require('./joi/userSchema');
const vaccincationSchema = require('./joi/vaccincationSchema');
const qrSchema = require('./joi/qrSchema');
const friendsSchema = require('./joi/friendsSchema');
const makeRandomCode = require('./makeRandomCode');

module.exports = {
    makeRandomCode,
    mailSender,
    userSchema,
    vaccincationSchema,
    qrSchema,
    friendsSchema,
};
