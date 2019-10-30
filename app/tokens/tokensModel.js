'use strict';

const mongoose = require('mongoose');

// Mongoose Schema constructor reference
const Schema = mongoose.Schema;

// Define token schema
const tokenSchema = new Schema(
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
    user: {
      immutable: true,
      index: true,
      required: true,
      trim: true,
      type: String
    },
    value: {
      immutable: true,
      required: true,
      type: String
    }
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

// Create token model
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
