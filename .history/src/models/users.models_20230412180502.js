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
    createdAt: {
        type : Date,
        value: moment().format("MM ddd, YYYY HH:mm")
    }, // Use `created_at` to store the created date
    updatedAt: moment().format("MM ddd, YYYY HH:mm") // and `updated_at` to store the last updated date
})
module.exports =  mongoose.model("User", userSchema);