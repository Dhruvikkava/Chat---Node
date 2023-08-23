const mongoose = require("mongoose");
const moment = require('moment');

const chatReceiver = new mongoose.Schema({  
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatMessages"
    },
    roomId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRooms"
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
module.exports =  mongoose.model("ChatReceiver", chatReceiver);