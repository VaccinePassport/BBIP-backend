const { User, Follow } = require('../../models');
const { userSchema } = require('../../util');
const { User } = require('../../models');
const { userSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { user_id, user_name } = req.body;

        const user = await User.findOne({
            where: { 
                email: user_id,
                name: user_name
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
