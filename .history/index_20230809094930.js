const express = require('express');
const app = express();
const port = 3000;
const routes = require('./src/routes/index');
const bodyParser = require("body-parser");
require('./src/configs/db');
require('./src/models');

app.use(express.json())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/api", routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Node Server Start at port ${port}`);
});

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});
const socketPort = 4000;