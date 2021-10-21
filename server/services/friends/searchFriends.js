const { User, Follow } = require('../../models');
const { userSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { user_id } = req.body;

        const user = await User.find({
            where: { 
                email: user_id,
             },
            attributes: { email, name }
        });
        if (user) {
            res.json({
                user_id : user.email,
                user_name : user.name
            });
        } else {
            res.status(400).json({
            message: 'user가 존재하지 않습니다.',
        });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: '알 수 없는 에러가 발생했습니다.',
        });
    }
}
