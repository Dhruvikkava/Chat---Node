const express = require('express');
const app = express();

app.use('/', require('./users/index'))

module.exports = router;