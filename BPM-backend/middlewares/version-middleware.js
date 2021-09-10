const VERSION = 'v1';
module.exports = (req, res, next) => {
    let version = req.params.version;
    if (version == VERSION) {
        next();
    } else {
        res.status(400).send({
            errorMessage: `현재 버전은 ${VERSION} 입니다.`,
        });
        return;
    }
};
