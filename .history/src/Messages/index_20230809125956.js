const express = require('express');
const app = express();
const mongoose = require('mongoose');
const chatMessagesModels = require('../models/chatMessages.models');

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
var userDetails = {}

io.on('connection', (socket) => {
  console.log('a user connected with ',socket.id);
  socket.on('connectUser', data => {
    let found = false;
    users.forEach(element => {
      if (element.user._id === data._id) {
        found = true;
      }
    });
    if (!found) {
      users.push({ socket_id: socket.id, user: data });
    }
    userDetails = users.find((data) => data.socket_id == socket.id)
    console.log('-------Logged In Users--------',users);
  });

  socket.on('message', async(message) => {    
    console.log(userDetails);
    let addUser = await chatMessagesModels.create({userId: userDetails._id, message:message})
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

httpServer.listen(socketPort, () => console.log(`Socket server listening on port ${socketPort}`));

module.exports = app;