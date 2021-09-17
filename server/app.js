const express = require('express');
const Http = require('http');

var path = require('path');
const jwt = require('jsonwebtoken');

const authMiddleware = require('./middlewares/auth');
const versionMiddleware = require('./middlewares/version');

const vaccincationRouter = require('./api-routes/vaccincation');
const userRouter = require('./api-routes/user');
//const qrRouter = require('./api-routes/qr');
//const friendsRouter = require('./api-routes/friends');
//const vaccinationAgencyRouter = require('./api-routes/vaccinationAgency');

const app = express();
const http = Http.createServer(app);

const PORT = 8080;
const HOST = '54.180.199.56';

app.get('/', (req, res) => {
    res.send({ message: '연결이 성공했습니다.' });
});

app.use(express.json());
app.use('/api/:version/user', versionMiddleware, [userRouter]);
app.use('/api/:version/vaccincation', versionMiddleware, [vaccincationRouter]);
//app.use('/api/:version/qr', versionMiddleware, [qrRouter]);
//app.use('/api/:version/friends', versionMiddleware, [friendsRouter]);
//app.use('/api/:version/vaccinationAgency', versionMiddleware, [vaccinationAgencyRouter]);

http.listen(PORT, () => {
    console.log(`listening at http://${HOST}:${PORT}`);
});

