const mongoose = require("mongoose");
const moment = require('moment');

const chatRooms = new mongoose.Schema({  
    unique_room_id: {
        type: String
    },
    roomName: {
        type: String
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
module.exports =  mongoose.model("ChatRooms", chatRooms);