const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');
const { User } = require('../models');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization == undefined) {
        res.status(401).send({
            message: '회원가입 후 사용하세요.',
        });
        return;
    }

    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            message: '회원가입 후 사용하세요.',
        });
        return;
    }

    try {
        const { userIdx } = jwt.verify(tokenValue, jwtKey);

        User.findByPk(userIdx).then((user) => {
            if (!user) {
                res.status(401).send({
                    message: '회원가입 후 사용하세요.',
                });
                return;
            }
            
            try{
                if (req.route.path != '/auth') {
                    if (user.sign_up_verification == 0) {
                        res.status(403).send({
                            message: '이메일 인증 후 사용하세요.',
                        });
                        return;
                    }
                }
            }catch(error){
                console.log(error,'\n');
                console.log(req.route);
            }

            res.locals.user = user;
            next();
        });
    } catch (error) {
        res.status(401).send({
            message: '회원가입 후 사용하세요.',
        });
        return;
    }
};
