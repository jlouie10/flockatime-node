'use strict';

const mongoose = require('mongoose');

// Mongoose Schema constructor reference
const Schema = mongoose.Schema;

// Define role schema
const roleSchema = new Schema(
  {
    name: {
      enum: ['ADMIN', 'USER'],
      immutable: true,
      index: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
      uppercase: true
    },
    privileges: [
      {
        ref: 'Privilege',
        type: Schema.Types.ObjectId
      }
    ]
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

// Create role model
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
