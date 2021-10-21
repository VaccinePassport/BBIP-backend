const { User, Follow } = require('../../models');
const { friendsSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { friend_id } = req.body;
        const user = res.locals.user;

        const friend = await User.findAll({
            where: { 
                email: friend_id,
             },
            attributes: [ 'idx_user' ]
        });
        
        await registerFriends(user.idx_user, friend[0].get('idx_user'));
        
        res.status(200).json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};

const registerFriends = async (followedIdx, followingIdx) => {
    try {
        return await Follow.create({
           following_id :followingIdx,
           followed_id : followedIdx
        });
    } catch (error) {
        return undefined;
    }
};
