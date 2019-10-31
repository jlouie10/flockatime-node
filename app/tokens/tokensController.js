'use strict';

const hashPass = require('hashpass');
const uuidv4 = require('uuid/v4');

const Token = require('./tokensModel');
const utils = require('../utils');

/**
 * Create a token
 */
function createToken(req, res, next) {
  const uuid = uuidv4();
  const tokenValue = hashPass(uuid);

  Token.create({
    description: req.body.description,
    salt: tokenValue.salt,
    user: res.locals.user,
    value: tokenValue.hash
  })
    .then(function(token) {
      const resBody = utils.formatTokenResponse(token);

      // Expose the token once in the response, after creation
      resBody.value = uuid;

      res.locals.attachment = {
        $addToSet: {
          tokens: resBody.id
        }
      };

      res.status(200).json(resBody);
      next();
    })
    .catch(function(err) {
      console.log(err);

      res.status(500).json({
        error: {
          code: 500,
          message: 'Internal server error'
        }
      });
    });
}

/**
 * List all tokens sorted by id, with the most recent tokens appearing first
 */
function listTokens(req, res) {
  Token.find(
    {
      $and: [
        {
          user: res.locals.user
        },
        utils.formatQuery(req.query)
      ]
    },
    '-salt -value'
  )
    .lean()
    .sort({ _id: -1 })
    .then(function(tokens) {
      res
        .status(200)
        .json(tokens.map(token => utils.formatTokenResponse(token)));
    })
    .catch(function(err) {
      console.log(err);

      res.status(500).json({
        error: {
          code: 500,
          message: 'Internal server error'
        }
      });
    });
}

/**
 * Retrieve a token by id
 */
function retrieveToken(req, res) {
  Token.findOne(
    {
      _id: req.params.id,
      user: res.locals.user
    },
    '-salt -value'
  )
    .lean()
    .then(function(token) {
      if (token === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such token: ${req.params.id}`
          }
        });
      } else {
        res.status(200).json(utils.formatTokenResponse(token));
      }
    })
    .catch(function(err) {
      console.log(err);

      res.status(500).json({
        error: {
          code: 500,
          message: 'Internal server error'
        }
      });
    });
}

/**
 * Update a token by id
 */
function updateToken(req, res, next) {
  Token.findOneAndUpdate(
    {
      _id: req.params.id,
      user: res.locals.user
    },
    req.body,
    { new: true }
  )
    .then(function(token) {
      if (token === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such token: ${req.params.id}`
          }
        });
      } else {
        res.locals.attachment = {
          $addToSet: {
            tokens: token._id
          }
        };

        res.status(200).json(utils.formatTokenResponse(token));
        next();
      }
    })
    .catch(function(err) {
      console.log(err);

      res.status(500).json({
        error: {
          code: 500,
          message: 'Internal server error'
        }
      });
    });
}

/**
 * Delete a token by id
 */
function deleteToken(req, res, next) {
  Token.deleteOne({
    _id: req.params.id,
    user: res.locals.user
  })
    .then(function(token) {
      if (token.deletedCount === 0) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such token: ${req.params.id}`
          }
        });
      } else {
        res.locals.attachment = {
          $pull: {
            tokens: req.params.id
          }
        };

        res.status(200).json({
          id: req.params.id,
          deleted: true
        });

        next();
      }
    })
    .catch(function(err) {
      console.log(err);

      res.status(500).json({
        error: {
          code: 500,
          message: 'Internal server error'
        }
      });
    });
}

module.exports = {
  create: createToken,
  list: listTokens,
  retrieve: retrieveToken,
  update: updateToken,
  del: deleteToken // Avoid 'delete' keyword in JS
};
