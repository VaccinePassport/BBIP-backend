const jwt = require('jsonwebtoken');
const { jwtEmailKey, jwtJoinKey, jwtQRKey } = require('../../config/config');

const verifyJWT = {
    verifyEmailToken: (token) => {
        return jwt.verify(token, jwtEmailKey);
    },
    verifyJoinToken: (token) => {
        return jwt.verify(token, jwtJoinKey);
    },
    verifyQrContent: (token) => {
        return jwt.verify(token, jwtQRKey);
    },
};

module.exports = verifyJWT;
