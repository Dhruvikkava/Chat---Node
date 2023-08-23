const express = require('express');
const app = express();

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});
const socketPort = 4000;

io.on('connection', (socket) => {
  console.log('a user connected',socket);

  socket.on('message', (message) => {
    console.log(message);
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

httpServer.listen(socketPort, () => console.log(`Socket server listening on port ${socketPort}`));

module.exports = app;