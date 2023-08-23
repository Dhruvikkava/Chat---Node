const mongoose = require("mongoose");
const moment = require('moment');

const chatRooms = new mongoose.Schema({  
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRooms"
    },
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
module.exports =  mongoose.model("ChatRooms", chatRooms);