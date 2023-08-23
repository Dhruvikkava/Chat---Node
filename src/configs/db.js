const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/my_new_db", {
  useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
  console.log("DB error ", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("DB connected !!!!!")
})