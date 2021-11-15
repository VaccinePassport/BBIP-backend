const { User, Follow } = require('../../models');
const Op = require('sequelize').Op;

module.exports = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const friend = await findFriends(user.idx_user);
        res.json({
            friend_list: friend,
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
    const followingList = await Follow.findAll({
        attributes: ['bookmark'],
        include: [{ model: User, required: true, as: 'following_list', attributes:['email','name','birth'], 
                    where: {name: {[Op.ne]: null}} }],
        where: {
            following_id: userIdx,
            accept: 1,
        },
    });

    const followedList = await Follow.findAll({
        attributes: ['bookmark'],
        include: [{ model: User, required: true, as: 'followed_list', attributes:['email','name','birth'], 
                    where: {name: {[Op.ne]: null}} }],
        where: {
            followed_id: userIdx,
            accept: 1,
        },
    });

    const friendList = [];
    for (request of followingList){
        arr = [request.get("following_list")]
        console.log("Arr : " + arr[0].get('0'))
        const result =  {
            ...arr["0"].dataValues,
            ...{"bookmark" : request.get("bookmark")}
        }
        friendList.push(result)
    }
    for (request of followedList){
        arr = [request.get("followed_list")]
        const result =  {
            ...arr["0"].dataValues,
            ...{"bookmark" : request.get("bookmark")}
        }
        friendList.push(result)
    }
    return friendList;
};
