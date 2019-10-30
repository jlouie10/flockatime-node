'use strict';

const mongoose = require('mongoose');

// Mongoose Schema constructor reference
const Schema = mongoose.Schema;

// Define privilege schema
const privilegeSchema = new Schema(
  {
    actions: {
      enum: ['CREATE', 'DELETE', 'LIST', 'RETRIEVE', 'UPDATE'],
      required: true,
      type: [String],
      validate: {
        message: 'Path `actions` is required.',
        validator: function(v) {
          const vLength = v.length;
          let valid = true;
          let i;

          // Check if array exists or is empty
          if (vLength !== 0) {
            for (i = 0; i < vLength; i++) {
              // Check if action exists in array
              if (!v[i]) {
                return (valid = false);
              }
            }
          } else {
            valid = false;
          }

          return valid;
        }
      }
    },
    name: {
      index: true,
      required: true,
      trim: true,
      type: String,
      unique: true
    },
    resource: {
      enum: [
        'FLOCKALOGS',
        'PRIVILEGES',
        'ROLES',
        'SESSIONS',
        'TOKENS',
        'USERS'
      ],
      immutable: true,
      required: true,
      trim: true,
      type: String,
      uppercase: true
    },
    role: {
      immutable: true,
      index: true,
      required: true,
      trim: true,
      type: String
    },
    scope: {
      enum: ['LIMITED', 'UNLIMITED'],
      required: true,
      trim: true,
      type: String,
      uppercase: true
    }
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

// Create privilege model
const Privilege = mongoose.model('Privilege', privilegeSchema);

module.exports = Privilege;
