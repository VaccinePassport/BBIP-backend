const express = require('express');
const { authMiddleware } = require('../middlewares');
const friendsService = require('../services/friends');

const router = express.Router();

router.get('/list', friendsService.getFriendList);
router.get('/request', friendsService.getFollowRequests);

router.post('/', friendsService.registerFriends);
router.patch('/', friendsService.bookmarkFriends);
router.delete('/:friendId', friendsService.deleteFriends);
router.get('/vaccination/:friendId', friendsService.getVaccinationInfo);


router.patch('/accept',friendsService.acceptFollowRequest);
router.get('/:userId', friendsService.searchFriend);
module.exports = router;
