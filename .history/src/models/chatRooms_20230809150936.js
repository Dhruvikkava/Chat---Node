const mongoose = require("mongoose");
const moment = require('moment');

const chatRooms = new mongoose.Schema({    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    unique_room_id: {
        type: String
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
module.exports =  mongoose.model("ChatRooms", chatRooms);