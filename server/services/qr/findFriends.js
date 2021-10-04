const { Follow } = require('../../models');
const sequelize = require('sequelize');

 /* idx_user와 친구인 [follow row & follow_idx에 해당하는 email] 찾기
    SELECT *, 
    (SELECT email FROM user where followed_id=idx_user) as followed_email
    FROM bbip.follow
    WHERE following_id = idx_user AND accept = 1;
*/
module.exports =  async (idx_user) => {
    try {
        const friends = await Follow.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(
                            `(SELECT email FROM user where followed_id=idx_user)`
                        ),
                        'followed_email',
                    ],
                ],
            },
            where: {
                following_id: idx_user,
                accept: 1,
            },
        });
        return friends;
    } catch (error) {
        return [];
    }
}