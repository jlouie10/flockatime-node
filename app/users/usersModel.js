'use strict';

const mongoose = require('mongoose');

// Mongoose Schema constructor reference
const Schema = mongoose.Schema;

// Define user schema
const userSchema = new Schema(
  {
    description: {
      default: null,
      trim: true,
      type: String
    },
    email: {
      index: true,
      lowercase: true,
      match: [/.+@.+\..+/],
      required: true,
      trim: true,
      type: String,
      unique: true
    },
    extensions: {
      vscode: {
        required: true,
        type: Boolean
      }
    },
    flockalogs: [
      {
        ref: 'Flockalog',
        type: Schema.Types.ObjectId
      }
    ],
    name: {
      required: true,
      trim: true,
      type: String
    },
    password: {
      required: true,
      type: String
    },
    role: {
      enum: ['ADMIN', 'USER'],
      required: true,
      trim: true,
      type: String,
      uppercase: true
    },
    salt: {
      required: true,
      type: String
    },
    sessions: [
      {
        ref: 'Session',
        type: Schema.Types.ObjectId
      }
    ],
    status: {
      enum: ['ACTIVE', 'INACTIVE'],
      required: true,
      trim: true,
      type: String,
      uppercase: true
    },
    tokens: [
      {
        ref: 'Token',
        type: Schema.Types.ObjectId
      }
    ]
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

// Create user model
const User = mongoose.model('User', userSchema);

module.exports = User;
