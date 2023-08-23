const mongoose = require("mongoose");
const moment = require('moment');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    },{
    timestamps: {
        createdAt: moment().format("MM ddd, YYYY HH:mm"), // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
})
module.exports =  mongoose.model("User", userSchema);