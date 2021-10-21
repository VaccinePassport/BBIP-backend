const getFollowRequests = require('./getFollowRequests');
const acceptFollowRequest = require('./acceptFollowRequest');
const getFriendList = require('./getFriendList');
const searchFriends = require('./searchFriends');
const registerFriends = require('./registerFriends');
const bookmarkFriends = require('./bookmarkFriends')
const deleteFriends = require('./deleteFriends')
const getVaccinationInfo = require('./getVaccinationInfo')

module.exports = {
    getFollowRequests: getFollowRequests,
    acceptFollowRequest: acceptFollowRequest,
    getFriendList : getFriendList,
    searchFriend: searchFriends,
    registerFriends: registerFriends,
    bookmarkFriends: bookmarkFriends,
    deleteFriends: deleteFriends,
    getVaccinationInfo: getVaccinationInfo
};
