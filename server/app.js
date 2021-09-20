const express = require('express');
const Http = require('http');
var path = require('path');
const jwt = require('jsonwebtoken');

const { authMiddleware, versionMiddleware } = require('./middlewares');
const { userRouter, vaccincationRouter, qrRouter } = require('./api-routes');
// qrRouter, friendsRouter, vaccinationAgencyRouter

const app = express();
const http = Http.createServer(app);

const PORT = 8080;
const HOST = '54.180.199.56';

app.get('/', (req, res) => {
    res.send({ message: '연결이 성공했습니다.' });
});

app.use(express.json());
app.use('/api/:version/user', versionMiddleware, userRouter);
app.use('/api/:version/vaccincation', versionMiddleware, authMiddleware, vaccincationRouter);
app.use('/api/:version/qr', versionMiddleware, qrRouter);
//app.use('/api/:version/friends', versionMiddleware, friendsRouter);
//app.use('/api/:version/vaccinationAgency', versionMiddleware, vaccinationAgencyRouter);

http.listen(PORT, () => {
    console.log(`listening at http://${HOST}:${PORT}`);
});
