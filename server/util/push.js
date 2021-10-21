const admin = require('firebase-admin')

var map = new Map();

const push = {
    pushAlarm: async (req, res, next) => {
        let { deviceToken, title, body } = req.body
        
        let message = {
            notification: {
                title,
                body
            },
            token : deviceToken
        }

        admin
            .messaging()
            .send(message)
            .then(function (response) {
                console.log("successfully sent message", response)
                return res.status(200).json({success:true})
            })
            .catch(function(err){
                console.log("error sending message", err)
                return res.status(400).json({success:false})
            });
    },
    pushAlarm2: async (deviceTokenList, title, body) => {
        for (const deviceToken of deviceTokenList) {
            let message = {
                notification: {
                    title,
                    body
                },
                token : deviceToken
            }
            await admin.messaging().send(message).catch(err => {
                console.log("error sending message", err);
            });
        }
    }
}

module.exports = push;
