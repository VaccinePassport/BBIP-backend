const { User, Follow } = require('../../models');

module.exports = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const friend = await findFriends(user.idx_user);
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

const findFriends = async (userIdx) => {
    /*
    SELECT email, name FROM bbip.follow f
    INNER JOIN bbip.user u ON u.idx_user = f.following_id
    WHERE bookmark = 1 AND followed_id = 16;
    */
    const followRequests = await Follow.findAll({
        attributes: [],
        include: [{ model: User, required: true, as: 'User_followed_id', attributes:['email','name'] }],
        where: {
            following_id: userIdx,
            bookmark: 1,
        },
    });
    const followRequestList = [];
    for (request of followRequests){
        followRequestList.push(request.get("User_followed_id"))
    }
    return followRequestList;
};
