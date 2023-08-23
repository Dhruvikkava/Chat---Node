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
var userDetails = {};
var roomMembers = [];

io.on('connection', (socket) => {
  console.log('a user connected with ',socket.id);
  socket.on('connectUser', async(data) => {
    let found = false;
    for (let index = 0; index < users.length; index++) {
      if (users[index].user._id === data._id) {
        console.log('index', index)
        users.splice(index, 1)
      }
    }
    users.forEach(element => {
      if (element.socket_id === socket.id) {
        found = true;
      }
    });
    if (!found) {
      users.push({ socket_id: socket.id, user: data });
    }
    userDetails = users.find((data) => data.socket_id == socket.id)
    console.log('-------Logged In Users--------',users);
    console.log("vvvvvvvvvvv",socket.id)
    console.log("vvvvvvvvvvvffffffffffffff",userDetails)
    let userId = new mongoose.Types.ObjectId(userDetails.user._id)
    let roomDetails = await chatRoomMembers.aggregate([     
      { $match: { user_id: userId } },
      {
      $lookup: {
          from: 'chatrooms', // The name of the products collection
          as: 'chatroom',
          foreignField: "_id",
          localField: "room_id",
        },
      },
      { $unwind: '$chatroom' }
    ])
    io.to(socket.id).emit('get_all_room_data',{response: roomDetails});
  });

  socket.on('message', async(message) => {   
    try {
        let roomData = await chatRooms.findOne({unique_room_id: message.roomId})

        let roomMembersData = await chatRoomMembers.find({room_id: roomData._id});
        let existRoomMembers = roomMembers.filter((el) => el.room_id == message.roomId)
        console.log({roomMembersData, existRoomMembers})

        let addUser = await chatMessagesModels.create({
          userId: message.userId, 
          message:message.message, 
          roomId:roomData._id,
          isRead: roomMembersData.length == existRoomMembers.length ? true : false
        })
        const getUserData = await chatMessagesModels.findById(addUser._id);
        io.to(message.roomId).emit('message', getUserData);
        console.log("message.roomId",message.roomId)
        console.log("membersData",roomMembers)
        // io.emit('message', getUserData);
    } catch (error) {
        console.log('err',error)
    }     
  });

  socket.on('createRoom', async(userData) => {   
    try {
        let generateUniqueString =  Math.random().toString(36).slice(2);
        let createRoom = await chatRooms.create({unique_room_id: generateUniqueString})
        await chatRoomMembers.create({room_id: createRoom._id, user_id:userData._id})

        let userId = new mongoose.Types.ObjectId(userData._id);
        let createdUserData = await usersModels.findOne({_id:userId});
        console.log("createdUserData",createdUserData)
        if(createdUserData){
          let findSocketUser = await users.find((userDetails) => userDetails.user._id == userData._id);
          console.log("uuuuuu",findSocketUser)
          io.to(findSocketUser.socket_id).emit('created_room_id', {createdRoomId: createRoom.unique_room_id});
        }
        socket.join(createRoom.unique_room_id);
        let checkUserExistInOtherRoom = roomMembers.filter((el) => {return el.room_id != createRoom.unique_room_id && el.user_id == userData._id})
        console.log("jjjjj",checkUserExistInOtherRoom)
        if(checkUserExistInOtherRoom.length != 0){
          checkUserExistInOtherRoom.forEach((el ) => {
            let index = roomMembers.findIndex(function (element) {
              return element.room_id == el.room_id && element.user_id == el.user_id;
            })
            roomMembers.splice(index, 1)
          })
        }
        let roomMemberExist = roomMembers.filter((el) => {return el.room_id == createRoom.unique_room_id && el.user_id == userData._id})
        console.log("fgfgf",roomMembers)
        if(roomMemberExist.length == 0){
          roomMembers.push({
            room_id: createRoom.unique_room_id,
            user_id: userData._id
          });
        }
        
        let roomDetails = await chatRoomMembers.aggregate([     
          { $match: { user_id: userId } },
          {
          $lookup: {
              from: 'chatrooms', // The name of the products collection
              as: 'chatroom',
              foreignField: "_id",
              localField: "room_id",
            },
          },
          { $unwind: '$chatroom' }
        ])
        io.to(socket.id).emit('get_all_room_data',{response: roomDetails});

        console.log("ssssddd", createRoom.unique_room_id)
    } catch (error) {
        console.log('err',error)
    }     
  });

  socket.on('joinRoom', async(roomData) => {   
    try {
        let checkUserJoined = await chatRooms.aggregate([
            { $match: { unique_room_id: roomData.roomId } },
            {
                $lookup: {
                    from: 'chatroommembers', // The name of the products collection
                    as: 'roomMembersData',
                    foreignField: "room_id",
                    localField: "_id"
                },
            },
        ])
        console.log("fffff",JSON.stringify(checkUserJoined))
        let checkUser = checkUserJoined[0].roomMembersData.filter(((el) => {return el.user_id == roomData.userId}))
        console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiii",checkUser)
        if(checkUser.length != 0){
            console.log("ddddf",checkUserJoined[0].unique_room_id)
            socket.join(checkUserJoined[0].unique_room_id);

            let checkUserExistInOtherRoom = roomMembers.filter((el) => {return el.room_id != checkUserJoined[0].unique_room_id && el.user_id == roomData.userId})
            console.log("jjjjjsdddd",checkUserExistInOtherRoom)

            if(checkUserExistInOtherRoom.length != 0){
              checkUserExistInOtherRoom.forEach((el ) => {
                let index = roomMembers.findIndex(function (element) {
                  return element.room_id == el.room_id && element.user_id == el.user_id;
                })
                roomMembers.splice(index, 1)
              })
            }

            let roomMemberExist = roomMembers.filter((el) => {return el.room_id == checkUserJoined[0].unique_room_id && el.user_id == roomData.userId})
            
            if(roomMemberExist.length == 0){
              roomMembers.push({
                room_id: checkUserJoined[0].unique_room_id,
                user_id: roomData.userId
              });              
            }
            let findSocketUser = await users.find((userDetails) => userDetails.user._id == roomData.userId);
            io.to(findSocketUser.socket_id).emit('created_room_id', {createdRoomId: checkUserJoined[0].unique_room_id});

            let roomMembersData = await chatRoomMembers.find({room_id: checkUserJoined[0]._id});
            let existRoomMembers = roomMembers.filter((el) => el.room_id == roomData.roomId)

            if(roomMembersData.length == existRoomMembers.length){
              let roomId = new mongoose.Types.ObjectId(checkUserJoined[0]._id)
              let updateReadMsg = await chatMessagesModels.updateMany({roomId: roomId},{ $set: {isRead: true}},{multi:true,upsert: true,new: true});
              console.log("bbbbbbbbbbbbbb", updateReadMsg)
            }
        }else{
            let createdData = await chatRoomMembers.create({room_id: checkUserJoined[0]._id, user_id:roomData.userId})
            let createdNewData = await chatRoomMembers.findOne({_id: new mongoose.Types.ObjectId(createdData._id)}).populate('room_id')
            socket.join(createdNewData.room_id.unique_room_id);

            let checkUserExistInOtherRoom = roomMembers.filter((el) => {return el.room_id != createdNewData.room_id.unique_room_id && el.user_id == roomData.userId})
            console.log("jjjjjsdddd233",checkUserExistInOtherRoom)
            if(checkUserExistInOtherRoom.length != 0){
              checkUserExistInOtherRoom.forEach((el ) => {
                let index = roomMembers.findIndex(function (element) {
                  return element.room_id == el.room_id && element.user_id == el.user_id;
                })
                roomMembers.splice(index, 1)
              })
            }

            let roomMemberExist = roomMembers.filter((el) => {return el.room_id == createdNewData.room_id.unique_room_id && el.user_id == roomData.userId})
            if(roomMemberExist.length == 0){
              roomMembers.push({
                room_id: createdNewData.room_id.unique_room_id,
                user_id: roomData.userId
              });
            }

            // let roomId = new mongoose.Types.ObjectId(createdData._id);
            console.log("ddddf2333",createdNewData)
            // let checkUserAleradyJoined = await chatRoomMembers.findOne({user_id:roomData.userId, room_id:roomId})
            let findSocketUser = await users.find((userDetails) => userDetails.user._id == roomData.userId);
            io.to(findSocketUser.socket_id).emit('created_room_id', {createdRoomId: createdNewData.room_id.unique_room_id});
            let userId = new mongoose.Types.ObjectId(roomData.userId);
            let roomDetails = await chatRoomMembers.aggregate([     
              { $match: { user_id: userId } },
              {
              $lookup: {
                  from: 'chatrooms', // The name of the products collection
                  as: 'chatroom',
                  foreignField: "_id",
                  localField: "room_id",
                },
              },
              { $unwind: '$chatroom' }
            ])
            io.to(socket.id).emit('get_all_room_data',{response: roomDetails});

            let roomMembersData = await chatRoomMembers.find({room_id: createdNewData.room_id._id});
            let existRoomMembers = roomMembers.filter((el) => el.room_id == roomData.roomId)

            if(roomMembersData.length == existRoomMembers.length){
              let roomId = new mongoose.Types.ObjectId(createdNewData.room_id._id)
              let updateReadMsg = await chatMessagesModels.updateMany({roomId: roomId},{ $set: {isRead: true}},{multi:true,upsert: true,new: true});
              console.log("bbbbbbbbbbbbbbnnnnnnnnn", updateReadMsg)
            }
        }
        let roomId = new mongoose.Types.ObjectId(checkUserJoined[0]._id);
        let roomUserData = await chatMessagesModels.aggregate([
          { $match: { roomId: roomId } },
        ])
        io.to(roomData.roomId).emit('oneRoomData', roomUserData);
        console.log("llllllllllllll",roomUserData)
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