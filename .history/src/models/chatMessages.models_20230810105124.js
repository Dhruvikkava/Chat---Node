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
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRooms"
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
module.exports =  mongoose.model("ChatMessages", chatMessages);