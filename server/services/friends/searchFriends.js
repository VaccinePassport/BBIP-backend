const { User } = require('../../models');
const Op = require('sequelize').Op;

module.exports = async (req, res, next) => {
    try {
        let { userId } = req.params;
        console.log(userId)

        const user = await User.findAll({
            where: { 
                [Op.and] : [{email: userId}, {name: {[Op.ne]: null}}],
             },
            attributes: [ 'email', 'name' ]
        });
        console.log(user)
        if (user[0]) {
            res.json({
                user_id : user[0].get('email'),
                user_name : user[0].get('name')
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
