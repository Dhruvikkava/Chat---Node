const mongoose = require("mongoose");
const moment = require('moment');

const chatMessages = new mongoose.Schema({    
    user_id: {
        type: String,        
    },
    userId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }
    ],
    message: {
        type: String
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
module.exports =  mongoose.model("ChatMessages", chatMessages);