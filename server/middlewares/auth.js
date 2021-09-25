const jwt = require('jsonwebtoken');
const { jwtJoinKey, jwtEmailKey } = require('../config/config');
const { User } = require('../models');

module.exports = (req, res, next) => {
    try {
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
        
        let jwtKey = jwtJoinKey;
        try {
            if (req.route.path == '/join') {
                jwtKey = jwtEmailKey;
            }
        } catch (error) {}

        const { userIdx } = jwt.verify(tokenValue, jwtKey);

        User.findByPk(userIdx).then((user) => {
            if (!user) {
                res.status(401).send({
                    message: '회원가입 후 사용하세요.',
                });
                return;
            }

            res.locals.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(401).send({
            message: '회원가입 후 사용하세요.',
        });
        return;
    }
};
