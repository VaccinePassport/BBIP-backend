const admin = require('firebase-admin')
const jwt = require('jsonwebtoken');
const { jwtQRKey } = require('../config/config');
const { User, Follow, Group } = require('../models');
const sequelize = require('sequelize');

var map = new Map();

const push = {
    pushAlarm: async (req, res, next) => {
        // 배열로 deviceToken, 사용자 id
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
            })
    }
}

module.exports = push;
