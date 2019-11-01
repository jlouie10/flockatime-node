'use strict';

const router = require('express').Router(); // Create a Router instance

const session = require('./sessions/sessionsController');
const token = require('./tokens/tokensController');

// Routes
router.use(authenticateRequest);

/**
 * Authenticate request by verifying if an API key or a session token exists
 */
function authenticateRequest(req, res, next) {
  // Prioritize API key before session token
  if (req.headers.authorization) {
    token
      .verify(req.headers.authorization)
      .then(function(result) {
        if (result) {
          next();
        } else {
          res.status(401).json({
            error: {
              code: 401,
              message: `Invalid API key provided: ${Array(
                req.headers.authorization.length - 3
              ).join('*') + req.headers.authorization.substr(-4)}`
            }
          });
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
  } else if (req.headers['x-session-token']) {
    session
      .verify(req.headers['x-session-token'])
      .then(function(result) {
        if (result) {
          next();
        } else {
          res.status(401).json({
            error: {
              code: 401,
              message: `Invalid session token provided: ${Array(
                req.headers['x-session-token'].length - 3
              ).join('*') + req.headers['x-session-token'].substr(-4)}`
            }
          });
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
  } else {
    res.status(401).json({
      error: {
        code: 401,
        message:
          'You did not provide an API key. You need to provide your API key in the authorization header.'
      }
    });
  }
}

module.exports = router;
