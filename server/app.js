const express = require('express');
const Http = require('http');
var path = require('path');
const jwt = require('jsonwebtoken');

// firebase - push
var admin = require('firebase-admin');
var serviceAccount = require('./firebase-bbip-admin.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const { authMiddleware, versionMiddleware } = require('./middlewares');
const {
    userRouter,
    vaccincationRouter,
    qrRouter,
    deviceTokenRouter,
    friendsRouter,
} = require('./api-routes');
//  vaccinationAgencyRouter

const app = express();
const http = Http.createServer(app);

const PORT = 8080;
const HOST = '54.180.199.56';

app.get('/', (req, res) => {
    res.send({ message: '연결이 성공했습니다.' });
});

app.use(express.json());
app.use('/api/:version/user', versionMiddleware, userRouter);
app.use(
    '/api/:version/vaccincation',
    versionMiddleware,
    authMiddleware,
    vaccincationRouter
);
app.use('/api/:version/qr', versionMiddleware, authMiddleware, qrRouter);
app.use(
    '/api/:version/device',
    versionMiddleware,
    authMiddleware,
    deviceTokenRouter
);
app.use(
    '/api/:version/friends',
    versionMiddleware,
    authMiddleware,
    friendsRouter
);

app.get('/pushTest', async (req, res, next) => {
  try {
    let { deviceToken, title, body } = req.query;
    console.log(deviceToken, title, body);
    
    let message = {
      notification: {
          title,
          body
      },
      token : deviceToken
    }
    await admin.messaging().send(message)
    res.json({result:"success"});
    return;
  } catch (error) {
    console.log(error);
    res.status(400).json({error});
  }
});

http.listen(PORT, () => {
    console.log(`listening at http://${HOST}:${PORT}`);
});
