const express = require('express');
const { authMiddleware } = require('../middlewares');
const friendsService = require('../services/friends');

const router = express.Router();

//router.post('/auth', friendsService.list); 빈파일이길래 우선 주석처리해놓음(파일위치때문에 충돌나서)
router.get('/request', friendsService.getFollowRequests);

module.exports = router;
