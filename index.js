'use strict';

const server = require('./src/server')
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URI, options);

// Start the web server
server.start(PORT);
