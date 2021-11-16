const { User, Follow } = require('../../models');
const Op = require('sequelize').Op;

module.exports = async (req, res, next) => {
    try {
        let { userId } = req.params;
        const user = res.locals.user;

        const friend = await User.findAll({
            where: {
                [Op.and]: [{ email: userId }, { name: { [Op.ne]: null } }],
            },
            attributes: ['email', 'name', 'idx_user']
        });

        if (friend[0]) {
            const exFollow = await Follow.findAll({
                where: {
                    following_id: user.idx_user,
                    followed_id: friend[0].get('idx_user'),
                },
            });
            if (exFollow[0]) {
                if (exFollow[0].get('accept') == 0 || exFollow[0].get('accept') == 1) {
                    res.json({
                        user_id: friend[0].get('email'),
                        user_name: friend[0].get('name'),
                        accpept : exFollow[0].get('accept') 
                    });
                } else {
                    res.json({
                        user_id: friend[0].get('email'),
                        user_name: friend[0].get('name')
                    });
                } 
            } else {
                const exFollow2 = await Follow.findAll({
                    where: {
                        following_id: friend[0].get('idx_user'),
                        followed_id: user.idx_user
                    },
                });
    
                if (exFollow2[0]) {
                    if (exFollow2[0].get('accept') == 0 || exFollow2[0].get('accept') == 1) {
                        res.json({
                            user_id: friend[0].get('email'),
                            user_name: friend[0].get('name'),
                            accpept : exFollow2[0].get('accept') 
                        });
                    } else {
                        res.json({
                            user_id: friend[0].get('email'),
                            user_name: friend[0].get('name')
                        });
                    } 
                } else {
                    res.json({
                        user_id: friend[0].get('email'),
                        user_name: friend[0].get('name')
                    });
                }
    
            }
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
