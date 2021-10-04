const { User, Follow } = require('../../models');

// (friend_list) 중에 idx_user와 친구인 [follow row & follow_idx에 해당하는 email, device_token] 찾기
module.exports = async (idx_user, friend_list) => {
    try {
        const friends = await Follow.findAll({
            where: {
                following_id: idx_user,
                accept: 1,
            },
            include: [
                {
                    model: User,
                    as: 'User_followed_id',
                    required: true,
                    attributes: ['email', 'device_token'],
                    where: {
                        email: friend_list,
                    },
                },
            ],
        });
        return friends;
    } catch (error) {
        console.log(error);
        return [];
    }
}