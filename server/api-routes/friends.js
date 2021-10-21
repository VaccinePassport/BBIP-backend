const express = require('express');
const { authMiddleware } = require('../middlewares');
const friendsService = require('../services/friends');

const router = express.Router();

router.get('/list', friendsService.getFriendList);
router.get('/', friendsService.searchFriends);
router.post('/', friendsService.registerFriends);
router.patch('/', friendsService.bookmarkFriends);
router.delete('/', friendsService.deleteFriends);
router.get('/vaccination', friendsService.getVaccinationInfo);

router.get('/request', friendsService.getFollowRequests);
router.patch('/accept',friendsService.acceptFollowRequest);
module.exports = router;
