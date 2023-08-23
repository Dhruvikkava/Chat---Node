const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const routes = require('./src/routes/index');
const bodyParser = require("body-parser");
const path = require('path');
require('./src/configs/db');
require('./src/models');
require('./src/Messages/index')

app.use(cors())
app.use(express.json())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/api", routes);
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Node Server Start at port ${port}`);
});
