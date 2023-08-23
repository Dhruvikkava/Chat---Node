const mongoose = require("mongoose");
const moment = require('moment');

const roleSchema = new mongoose.Schema({
    role: {
        type: String,        
    },
    address: {
        type: String
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
module.exports =  mongoose.model("Role", roleSchema);