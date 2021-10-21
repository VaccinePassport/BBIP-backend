const { User, Follow } = require('../../models');
const { userSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        const { user_id } = req.body
        const user = res.locals.user;
       
        // 이메일로 아이디 찾기
        const following_idx = await User.findOne({
            attributes:['id'],
            where:{
                email: user_id
            },
        })

        await Follow.destroy({
            where : { 
                following_id : following_idx,
                followed_id : user.idx_user
            },
        });
        res.json({
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};