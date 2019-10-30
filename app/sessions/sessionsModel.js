'use strict';

const mongoose = require('mongoose');

// Mongoose Schema constructor reference
const Schema = mongoose.Schema;

// Define session schema
const sessionSchema = new Schema(
  {
    description: {
      default: null,
      trim: true,
      type: String
    },
    salt: {
      immutable: true,
      required: true,
      type: String
    },
    sessionToken: {
      immutable: true,
      required: true,
      type: String
    },
    user: {
      immutable: true,
      index: true,
      required: true,
      trim: true,
      type: String
    }
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

// Create session model
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
