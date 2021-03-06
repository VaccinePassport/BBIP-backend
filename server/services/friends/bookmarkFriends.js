const { User, Follow } = require('../../models');
const { userSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { friend_id, bookmark } = req.body;
        const user = res.locals.user;

        const followingIdx = await User.findAll({
            attributes:['idx_user'],
            where:{
                email: friend_id
            },
        })

        const exFollow = await Follow.findAll({
            where: {
                following_id: user.idx_user,
                followed_id: followingIdx[0].get('idx_user')
            },
        });

        console.log(exFollow);
        console.log(exFollow[0])

        if (exFollow[0]) {
            await Follow.update({ 
                following_bookmark: bookmark, 
            },{
                where: { 
                    following_id: user.idx_user,
                    followed_id: followingIdx[0].get('idx_user'),
                }}
            );
        } else {
            await Follow.update({ 
                followed_bookmark: bookmark, 
            },{
                where: { 
                    following_id: followingIdx[0].get('idx_user'),
                    followed_id: user.idx_user
                }}
            );
        }

        // await Follow.update({ 
        //     bookmark: bookmark, 
        // },{
        //     where: { 
        //         following_id: user.idx_user,
        //         followed_id: followingIdx[0].get('idx_user'),
        //     }}
        // );
        
        res.status(201).send({});
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};
