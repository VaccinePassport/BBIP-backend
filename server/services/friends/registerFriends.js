const { User, Follow } = require('../../models');
const { friendsSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        const { friend_id } = req.body;
        
        await registerFriends(followedIds, followingEmail, friend_id);
        
        res.status(200).json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};

const findUserIdxInRequestList = async (followedIdx, followingEmail) => {
    try {
        const followingIdx = await Follow.findAll({
            attributes: ['following_id'],
            include: [
                {
                    model: User,
                    required: true,
                    as: 'User_following_id',
                    where: { email: followingEmail },
                    attributes: [],
                },
            ],
            where: {
                followed_id: followedIdx,
                accept: 0,
            },
        });
        return followingIdx[0].get('following_id');
    } catch (error) {
        return undefined;
    }
};

const registerFriends = async (followedIdx, followingIdx, accept) => {
    try {
        return await Follow.update(
            {
                accept,
            },
            { where: { following_id: followingIdx, followed_id: followedIdx } }
        );
    } catch (error) {
        return undefined;
    }
};
