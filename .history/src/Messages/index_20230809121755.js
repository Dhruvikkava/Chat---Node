const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/my_new_db", {
  useNewUrlParser: "true",
  useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected socket with database');
});

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});
const socketPort = 4000;

let users = [];

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);

  socket.on('connectUser', data => {
    console.log("data", data)
    let found = false;
    users.forEach(element => {
      if (element.user._id === data.user._id) {
        found = true;
      }
    });
    if (!found) {
      users.push({ socket_id: socket.id, user: data.user });
    }
    console.log('-------Logged In Users--------');
    console.log(users);
  
    // do your other stuff here
  });

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

httpServer.listen(socketPort, () => console.log(`Socket server listening on port ${socketPort}`));

module.exports = app;