const { User, Follow } = require('../../models');
const { userSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { friend_id, bookmark } = req.body;
        const user = res.locals.user;

        const followed_idx = await User.findOne({
            attributes:['idx_user'],
            where:{
                email: friend_id
            },
        })

        await Follow.update({ 
            bookmark: bookmark, 
        },{
            where: { 
                followed_id: followed_idx[0].get('idx_user'),
                following_id: user.idx_user
            }}
        );
        
        res.status(201).send({});
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};
