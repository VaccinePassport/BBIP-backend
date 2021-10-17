const { User, Follow } = require('../../models');
const { userSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const requestList = await getFollowRequestList(user.idx_user);
        res.json({
            friend_list: requestList,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};

const getFollowRequestList = async (userIdx) => {
    /*
    SELECT email, name FROM bbip.follow f
    INNER JOIN bbip.user u ON u.idx_user = f.following_id
    WHERE accept = 0 AND followed_id = 16;
    */
    const followRequests = await Follow.findAll({
        attributes: [],
        include: [{ model: User, required: true, as: 'User_following_id', attributes:['email','name'] }],
        where: {
            followed_id: userIdx,
            accept: 0,
        },
    });
    const followReqestList = [];
    for (request of followRequests){
        followReqestList.push(request.get("User_following_id"))
    }
    return followReqestList;
};
