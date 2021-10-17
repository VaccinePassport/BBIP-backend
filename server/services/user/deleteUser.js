const { User, Follow, Group } = require('../../models');
var sdk = require('../../sdk/sdk');
const Op = require('sequelize').Op;

module.exports = {
    deleteUserInfo: async (req, res, next) => {
        try {
            const user = res.locals.user;
            console.log('hey');

            await User.update(
                {
                    phone: null,
                    name: null,
                    birth: null,
                    gender: null,
                    device_token: null,
                    qr_password: null,
                    verification_number: null,
                },
                { where: { idx_user: user.idx_user } }
            );

            // Delete friends & group
            await deleteFollowAndGroup(user.idx_user);

            // Delete existing information stored on the blockchain
            const resultJSON = await deleteVaccincation(user.idx_user);
            if (resultJSON.message == 'success') {
                res.status(204).end();
            } else {
                throw new Error('deleteUser(QR) - error');
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({
                message:
                    '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
            });
        }
    },
    deleteFollowAndGroup: async (userIdx) => {
        const followIdxList = await findFollowIdxList(userIdx);
        if (followIdxList) {
            await Group.destroy({
                where: {
                    idx_follow: followIdxList,
                },
            });
            await Follow.destroy({
                where: {
                    idx_follow: followIdxList,
                },
            });
        }
    },
    deleteVaccincation: async(userIdx)=>{
        let args = [userIdx];
        let result = await sdk.send(
            false,
            'deleteCertificateByUserId',
            args
        );
        return JSON.parse(result);
    },
    findFollowIdxList: async (userIdx) => {
        try {
            const follows = await Follow.findAll({
                attribute: ['idx_follow'],
                where: {
                    [Op.or]: [
                        {
                            followed_id: userIdx,
                        },
                        {
                            following_id: userIdx,
                        },
                    ],
                },
            });
            const followIdxList = [];
            for (const follow of follows) {
                followIdxList.push(follow.get('idx_follow'));
            }

            return followIdxList;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    },
};
