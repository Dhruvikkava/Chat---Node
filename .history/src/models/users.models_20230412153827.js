const Mongoose = require("mongoose")
const userSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
})
Mongoose.model("User", userSchema)