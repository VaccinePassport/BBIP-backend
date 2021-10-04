const jwt = require('jsonwebtoken');
const { jwtEmailKey, jwtJoinKey, jwtQRKey } = require('../../config/config');

const signJWT = {
    makeEmailToken: (userIdx) => { // email auth token
        return jwt.sign(
            { userIdx: userIdx },
            jwtEmailKey,
            {
                expiresIn: '1h',
            }
        );
    },
    makeJoinToken: (userIdx) => { // register token
        return jwt.sign({ userIdx: userIdx }, jwtJoinKey)
    },
    makeQrContent: (vaccineIndexList) => { //qr token
        return jwt.sign(
            { vaccine_index: vaccineIndexList },
            jwtQRKey,
            {
                expiresIn: '120s',
            }
        );
    },
};

module.exports = signJWT;