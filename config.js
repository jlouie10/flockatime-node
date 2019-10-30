'use strict';

const config = {
  local: {
    mongodb: {
      uri: process.env.MONGODB_URI_LOCAL
    },
    apiKeys: {}
  },
  prod: {
    mongodb: {
      uri: process.env.MONGODB_URI
    },
    apiKeys: {}
  }
};

module.exports = config[process.env.APP_ENV || 'local'];
