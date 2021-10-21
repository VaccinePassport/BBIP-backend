const { User, Follow } = require('../../models');
const { userSchema } = require('../../util');
const deleteFriends = require('./deleteFriends');

module.exports = async (req, res, next) => {
    try {
        const { friend_id } = req.body
        const user = req.user_id
        const friend = await deleteFriends(friend_id);
        res.json({
            friend: friend,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};

const deleteFriends = async (userIdx) => {
    /*
    SELECT email, name FROM bbip.follow f
    INNER JOIN bbip.user u ON u.idx_user = f.following_id
    WHERE bookmark = 1 AND followed_id = 16;
    */
    const followRequests = await Follow.findAll({
        attributes: [],
        include: [{ model: User, required: true, as: 'User_following_id', attributes:['email','name'] },
                  { model: Follow, required: true, as: 'User_following_id', attributes:['bookmark'] }],
        where: {
            followed_id: userIdx,
            bookmark: 1,
        },
    });
    const followRequestList = [];
    for (request of followRequests){
        followRequestList.push(request.get("User_following_id"))
    }
    return followRequestList;
};
