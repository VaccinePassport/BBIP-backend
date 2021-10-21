const userRouter = require('./user');
const vaccincationRouter = require('./vaccincation');
const qrRouter = require('./qr');
const deviceTokenRouter = require('./deviceToken');
const friendsRouter = require('./friends');
const deviceRouter = require('./deviceToken')

module.exports = {
    userRouter,
    vaccincationRouter,
    qrRouter,
    deviceTokenRouter,
    friendsRouter,
    deviceRouter
};