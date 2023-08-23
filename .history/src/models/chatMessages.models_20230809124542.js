const mongoose = require("mongoose");
const moment = require('moment');

const chatMessages = new mongoose.Schema({    
    user_id: {
        type: String,        
    },
    messages: {
        type: String
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
module.exports =  mongoose.model("ChatMessages", chatMessages);