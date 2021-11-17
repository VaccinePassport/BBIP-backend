const admin = require('firebase-admin')
const { Expo } = require('expo-server-sdk');
let serviceAccount = require("../firebase-bbip-admin.json"); 
//try{ admin.initializeApp() } catch(err){ admin.app() }

const push = {
    pushAlarm: async (deviceTokenList, title, body, page) => {
        let expo = new Expo();
        for (const deviceToken of deviceTokenList){
            if (!Expo.isExpoPushToken(deviceToken)) {
                console.log('[push token error]');
                continue;
            }
    
            let message = [];
            message.push({
                to: deviceToken,
                title,
                body,
                sound: 'default',
                channelId: 'notifications',
                priority: 'high',
                data: {
                    page,
                },
            });
    
            let chunks = expo.chunkPushNotifications(message);
            let tickets = [];
            (async () => {
                for (let chunk of chunks) {
                    try {
                        let ticketChunk = await expo.sendPushNotificationsAsync(
                            chunk
                        );
                        console.log(ticketChunk);
                        tickets.push(...ticketChunk);
                    } catch (error) {
                        console.error(error);
                        continue;
                    }
                }
            })();
        }
    }
}

module.exports = push;
