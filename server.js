'use strict';

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const config = require('./config');

const app = express();
const PORT = process.env.PORT || 9000;

// Set up Express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongodb.uri, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Start server
app.listen(PORT);
