'use strict';

const mongoose = require('mongoose');

// Mongoose Schema constructor reference
const Schema = mongoose.Schema;

// Define FlockaLog schema
const flockalogSchema = new Schema(
  {
    timestamps: {
      immutable: true,
      required: true,
      type: [Number],
      validate: {
        message: 'Path `timestamps` is required.',
        validator: function(v) {
          const vLength = v.length;
          let valid = true;
          let i;

          // Check if array exists or is empty
          if (vLength !== 0) {
            for (i = 0; i < vLength; i++) {
              // Check if timestamp exists in array
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

// Create FlockaLog model
const Flockalog = mongoose.model('Flockalog', flockalogSchema);

module.exports = Flockalog;
