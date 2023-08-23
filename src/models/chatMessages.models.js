const mongoose = require("mongoose");
const moment = require('moment');

const chatMessages = new mongoose.Schema({    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    message: {
        type: String,
        default:null
    },
    file:{
        type: String,
        default:null
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
