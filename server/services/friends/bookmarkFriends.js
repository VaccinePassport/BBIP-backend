const { User, Follow } = require('../../models');
const { userSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { friend_id, bookmark } = req.body;
        const user = res.locals.user;

        // if (bookmark == 0 ) {
        //     bookmark = 1
        // } else if (bookmark == 1){
        //     bookmark = 0
        // } else {
        //     // bookmark 옵션??
        // }  

        // 이메일로 아이디 찾기
        const following_idx = await User.findOne({
            attributes:['id'],
            where:{
                email: friend_id
            },
        })

        await Follow.update({ 
            bookmark: bookmark, 
        },{
            where: { 
                followed_id: user.idx_user,
                following_id: following_idx
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
