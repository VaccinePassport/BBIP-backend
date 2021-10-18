const { Follow, Group } = require('../../models');
const getPermission = require('./getGroupPermission');
const groupQr = require('./groupQr');
const calcDistance = require('../../util/calcDistance');
const { qrSchema } = require('../../util');

module.exports = async (req, res, next) => {
    try {
        let { group_no, permission, latitude, longitude } = await qrSchema.patchPermission.validateAsync(req.body);
        const user = res.locals.user;
        console.log(group_no, '번 그룹의 동행인');

        // SELECT * FROM bbip.group where idx_follow in (SELECT idx_follow FROM bbip.follow WHERE followed_id = 16) AND group_no = 3;
        const group = await Group.findAll({
            include: [
                {
                    model: Follow,
                    as: 'Follow_idx_follow',
                    where: { followed_id: user.idx_user },
                },
            ],
            where: {
                group_no,
            },
        });

        if (group.length === 0) {
            res.status(400).json({
                message: '해당 qr 신청은 존재하지 않습니다.',
            });
            return;
        }

        // 일정 거리 밖이면 자동 거부
        const distance = calcDistance(latitude, longitude, group[0].latitude, group[0].longitude);
        console.log(distance);
        if(distance > 150){
            permission = -1;
        }

        // permission 변경
        await Group.update(
            {
                accept: permission,
            },
            { where: { idx_group: group[0].idx_group } }
        );

        let groupPermission = await getPermission(group_no);
        if (!groupPermission) {
            res.json({ message: '타당하지 않은 group no' });
            return;
        }

        // 누구 하나라도 비동의 / 모두 동의 시
        try {
            let resolveF = groupQr.resolveMap.get(group_no);
            if (
                groupPermission.get('acceptFriends') ==
                groupPermission.get('allFriends')
            ) {
                resolveF('success');
            } else if (groupPermission.get('rejectFriends') > 0) {
                resolveF('fail');
            }
        } catch (error) {}
        res.json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: '알 수 없는 에러 발생' });
    }
}

