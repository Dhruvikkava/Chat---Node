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
            // {
            //     $lookup: {
            //         from: 'chatroommembers', // The name of the products collection
            //         as: 'roomMembersData',
            //         foreignField: "room_id",
            //         localField: "_id",
            //         pipeline: [
            //             {
            //                 $lookup: {
            //                     from: 'users', // The name of the products collection
            //                     as: 'user',
            //                     foreignField: "_id",
            //                     localField: "user_id",
            //                 }
            //             }
            //         ]
            //     },
            // },
        ])
    socket.emit('get_all_room_data',{response: roomDetails});
  });

  socket.on('message', async(message) => {   
    try {
        let roomData = await chatRooms.findOne({unique_room_id: message.roomId})
        let addUser = await chatMessagesModels.create({userId: message.userId, message:message.message, roomId:roomData._id})
        const getUserData = await chatMessagesModels.findById(addUser._id);
        console.log("message.roomId",message.roomId)
        io.to(message.roomId).emit('message', getUserData);
        // io.emit('message', getUserData);
    } catch (error) {
        console.log('err',error)
    }     
  });

  // socket.on('get_all_room_data', async(message) => {   
  //   try {
  //     let userDetails = users.find((el) => el.socket_id == socket.id)
  //     console.log("ooooooooooo", userDetails)
  //   } catch (error) {
  //       console.log('err',error)
  //   }     
  // });

  // function getAllRoomData(){
  //   let userDetails = users.find((el) => el.socket_id == socket.id)
  //   console.log("first",userDetails)
  //   socket.emit('get_all_room_data',{response: userDetails});
  // }
  // getAllRoomData();

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

        console.log("ssssddd", createRoom.unique_room_id)
    } catch (error) {
        console.log('err',error)
    }     
  });

  socket.on('joinRoom', async(roomData) => {   
    try {
        // let checkUserJoined = await chatRoomMembers.findOne({room_id: roomData.roomId, user_id:roomData.userId}).populate('room_id')
        
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
            // let findSocketUser = await users.find((userDetails) => userDetails.user._id == roomData.userId);
            // io.to(findSocketUser.socket_id).emit('created_room_id', {createdRoomId: checkUserJoined[0].unique_room_id});
        }else{
            let createdData = await chatRoomMembers.create({room_id: checkUserJoined[0]._id, user_id:roomData.userId})
            let createdNewData = await chatRoomMembers.findOne({_id: new mongoose.Types.ObjectId(createdData._id)}).populate('room_id')
            socket.join(createdNewData.room_id.unique_room_id);
            
            // let roomId = new mongoose.Types.ObjectId(createdData._id);
            console.log("ddddf2333",createdNewData)
            // let checkUserAleradyJoined = await chatRoomMembers.findOne({user_id:roomData.userId, room_id:roomId})
            let findSocketUser = await users.find((userDetails) => userDetails.user._id == roomData.userId);
            io.to(findSocketUser.socket_id).emit('created_room_id', {createdRoomId: createdNewData.room_id.unique_room_id});
        }
        // let roomId = new mongoose.Types.ObjectId(roomData.roomId);
        // let roomDetails = await chatRooms.aggregate([
        //     { $match: { _id: roomId } },
        //     {
        //         $lookup: {
        //             from: 'chatroommembers', // The name of the products collection
        //             as: 'roomMembersData',
        //             foreignField: "room_id",
        //             localField: "_id",
        //             pipeline: [
        //                 {
        //                     $lookup: {
        //                         from: 'users', // The name of the products collection
        //                         as: 'user',
        //                         foreignField: "_id",
        //                         localField: "user_id",
        //                     }
        //                 }
        //             ]
        //         },
        //     },
        // ])
        // console.log("aaaadd", roomDetails[0].roomMembersData)
        // console.log("aaaa", roomDetails)
    } catch (error) {
        console.log('err',error)
    }     
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

function getAllRoomData(socketId){
  let userDetails = users.find((el) => el.socket_id == socketId)
  socket.emit('get_all_room_data',userDetails);
}

httpServer.listen(socketPort, () => console.log(`Socket server listening on port ${socketPort}`));

module.exports = app;