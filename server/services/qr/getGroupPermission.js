const { Group } = require('../../models');
const sequelize = require('sequelize');

/* group_no가 같은 로우 중에 accept가 1인 경우의 개수, -1인 경우의 개수, 모든 친구의 개수
    SELECT count(CASE WHEN accept=1 THEN 1 END) as 'acceptFriends', 
        count(CASE WHEN accept=-1 THEN 1 END) as 'rejectFriedns',
        count(*) as 'allFriends'
    From bbip.group
    WHERE group_no = 2;
*/
module.exports = async (groupNo) => {
    try {
        let group = await Group.findOne({
            where: {
                group_no: groupNo,
            },
            attributes: [
                [
                    sequelize.literal(
                        'count(CASE WHEN accept=1 THEN 1 END)'
                    ),
                    'acceptFriends',
                ],
                [
                    sequelize.literal(
                        'count(CASE WHEN accept=-1 THEN 1 END)'
                    ),
                    'rejectFriends',
                ],
                [sequelize.literal('count(*)'), 'allFriends'],
            ],
        });
        return group;
    } catch (error) {
        console.log(error);
    }
};