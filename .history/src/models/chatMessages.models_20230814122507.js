const mongoose = require("mongoose");
const moment = require('moment');

const chatMessages = new mongoose.Schema({    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    message: {
        type: String
    },
    file:{
        type: String
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRooms"
    },
    isRead: {
        type:Boolean,
        default: 0,
        content: "0: not read, 1: read"
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
module.exports =  mongoose.model("ChatMessages", chatMessages);


// let userId = new mongoose.Types.ObjectId(userDetails.user._id)
// let roomDetails = await chatRoomMembers.aggregate([     
//     { $match: { user_id: userId } },
//     {
//     $lookup: {
//         from: 'chatrooms', // The name of the products collection
//         as: 'chatroom',
//         foreignField: "_id",
//         localField: "room_id",
//         pipeline: [
//         {
//             $lookup: {
//             from: 'chatmessages', // The name of the collection you want to join
//             foreignField: 'roomId', // Field from the 'customers' collection
//             localField: '_id', // Field from the 'orders' collection
//             as: 'chatMessages', // Alias for the joined data,                
//             pipeline:[
//                 {
//                 $match:{
//                     isRead: false
//                 },
//                 },
//                 {
//                 $project: {
//                     chatMessages:0
//                 }
//                 }
//             ]
//             },
//         },            
//         ]
//     }        
//     },      
//     { $unwind: '$chatroom' },
//     {
//     $project:{
//         unreadChatMessages:{$size: '$chatroom.chatMessages'},
//         chatroom: 1
//     }
//     }
// ])
// io.to(socket.id).emit('get_all_room_data',{response: roomDetails});