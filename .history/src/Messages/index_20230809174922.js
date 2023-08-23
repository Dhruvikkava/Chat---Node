const express = require('express');
const app = express();
const mongoose = require('mongoose');
const chatMessagesModels = require('../models/chatMessages.models');
const chatRoomMembers = require('../models/chatRoomMembers');
const chatRooms = require('../models/chatRooms');
const usersModels = require('../models/users.models');

mongoose.connect("mongodb://localhost:27017/my_new_db", {
  useNewUrlParser: "true",
  useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected socket with database');
});

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});
const socketPort = 4000;

let users = [];
var userDetails = {}

io.on('connection', (socket) => {
  console.log('a user connected with ',socket.id);
  socket.on('connectUser', data => {
    let found = false;
    users.forEach(element => {
      if (element.user._id === data._id) {
        found = true;
      }
    });
    if (!found) {
      users.push({ socket_id: socket.id, user: data });
    }
    userDetails = users.find((data) => data.socket_id == socket.id)
    console.log('-------Logged In Users--------',users);
  });

  socket.on('message', async(message) => {   
    try {
        let addUser = await chatMessagesModels.create({userId: message.userId, message:message.message})
        const getUserData = await chatMessagesModels.findById(addUser._id);
        io.emit('message', getUserData);
    } catch (error) {
        console.log('err',error)
    }     
  });

  socket.on('createRoom', async(userData) => {   
    try {
        let generateUniqueString =  Math.random().toString(36).slice(2);
        let createRoom = await chatRooms.create({unique_room_id: generateUniqueString})
        await chatRoomMembers.create({room_id: createRoom._id, user_id:userData._id})
        socket.join(generateUniqueString);
        console.log("ssssddd", userData)
    } catch (error) {
        console.log('err',error)
    }     
  });

  socket.on('joinRoom', async(roomData) => {   
    try {
        await chatRoomMembers.create({room_id: roomData.roomId, user_id:roomData.userId})
        let roomId = new mongoose.Types.ObjectId(roomData.roomId);
        let roomDetails = await chatRooms.aggregate([
            { $match: { _id: roomId } },
            {
                $lookup: {
                    from: 'chatroommembers', // The name of the products collection
                    as: 'roomMembersData',
                    foreignField: "room_id",
                    localField: "_id",
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users', // The name of the products collection
                                as: 'user',
                                foreignField: "_id",
                                localField: "user_id",
                            }
                        }
                    ]
                },
            },
        ])
        console.log("aaaadd", roomDetails[0].roomMembersData)
        console.log("aaaa", roomDetails)
    } catch (error) {
        console.log('err',error)
    }     
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

httpServer.listen(socketPort, () => console.log(`Socket server listening on port ${socketPort}`));

module.exports = app;