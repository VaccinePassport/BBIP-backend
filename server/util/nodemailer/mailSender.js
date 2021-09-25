const nodemailer = require('nodemailer');
const { emailId, emailPwd } = require('../../config/config');

const mailSubject = function (code) {
    return `BBIP 인증번호 : ${code}`;
};
const mailText = function (name, code) {
    return `안녕하세요, ${name}님! BBIP의 인증번호는 다음과 같습니다. \n\n ${code} \n\n 이 이메일을 요청하지 않았다면, 이메일을 무시하세요.`;
};

const mailSender = {
    sendGmail: function (receiver) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            prot: 587,
            host: 'smtp.gmlail.com',
            secure: false,
            requireTLS: true,
            auth: {
                user: emailId,
                pass: emailPwd,
            },
        });
 
        var mailOptions = {
            from: emailId,
            to: receiver.email,
            subject: mailSubject(receiver.code),
            text: mailText(receiver.name, receiver.code),
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });
    },
};

module.exports = mailSender;
