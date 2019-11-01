'use strict';

const router = require('express').Router(); // Create a Router instance

const role = require('./roles/rolesController');
const session = require('./sessions/sessionsController');
const token = require('./tokens/tokensController');
const user = require('./users/usersController');

// Routes
router.use(authenticateRequest, authorizeRequest);

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
          res.locals.user = result.user;
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
          res.locals.user = result.user;
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

/**
 * Authorize request by validating user's role
 */
function authorizeRequest(req, res, next) {
  let errorMessage;

  user
    .retrieveById(res.locals.user)
    .then(function(result) {
      if (result === null) {
        if (req.headers.authorization) {
          errorMessage = `Invalid API key provided: ${Array(
            req.headers.authorization.length - 3
          ).join('*') + req.headers.authorization.substr(-4)}`;
        } else {
          errorMessage = `Invalid session token provided: ${Array(
            req.headers['x-session-token'].length - 3
          ).join('*') + req.headers['x-session-token'].substr(-4)}`;
        }

        res.status(401).json({
          error: {
            code: 401,
            message: errorMessage
          }
        });
      } else {
        return role.retrieveByName(result.role);
      }
    })
    .then(function(result) {
      if (result === null) {
        if (req.headers.authorization) {
          errorMessage = `Invalid API key provided: ${Array(
            req.headers.authorization.length - 3
          ).join('*') + req.headers.authorization.substr(-4)}`;
        } else {
          errorMessage = `Invalid session token provided: ${Array(
            req.headers['x-session-token'].length - 3
          ).join('*') + req.headers['x-session-token'].substr(-4)}`;
        }

        res.status(401).json({
          error: {
            code: 401,
            message: errorMessage
          }
        });
      } else {
        const method = req.method;

        // Remove leading and trailing slashes from path
        const path = req.path.replace(/^\/+|\/+$/g, '').split('/');

        let requestIdExists = false;
        let actions;
        let requestId;
        let resource;
        let scope;

        // Parse the path from these examples:
        // '/users'
        // '/users/:id/flockalogs'
        // '/users/:id' or '/users/:id/flockalogs/:id'
        if (path.length === 1) {
          resource = path[path.length - 1].toUpperCase();
        } else if (path.length === 3) {
          resource = path[path.length - 1].toUpperCase();
          requestId = path[1];
        } else {
          requestIdExists = true;
          resource = path[path.length - 2].toUpperCase();
          requestId = path[1];
        }

        // Retrieve actions from a privilege with a corresponding resource
        result.privileges.some(privilege => {
          if (privilege.resource === resource) {
            actions = privilege.actions;
            scope = privilege.scope;

            return true;
          } else {
            return false;
          }
        });

        if (
          actions &&
          (((method === 'POST' && actions.includes('CREATE')) ||
            (method === 'GET' &&
              ((!requestIdExists && actions.includes('LIST')) ||
                (requestIdExists && actions.includes('RETRIEVE')))) ||
            (method === 'PATCH' && actions.includes('UPDATE')) ||
            (method === 'DELETE' && actions.includes('DELETE'))) &&
            // If user has LIMITED scope, user id must match the parent request id
            ((scope === 'LIMITED' && res.locals.user === requestId) ||
              scope === 'UNLIMITED'))
        ) {
          next();
        } else {
          if (req.headers.authorization) {
            errorMessage = `Invalid API key provided: ${Array(
              req.headers.authorization.length - 3
            ).join('*') + req.headers.authorization.substr(-4)}`;
          } else {
            errorMessage = `Invalid session token provided: ${Array(
              req.headers['x-session-token'].length - 3
            ).join('*') + req.headers['x-session-token'].substr(-4)}`;
          }

          res.status(401).json({
            error: {
              code: 401,
              message: errorMessage
            }
          });
        }
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

module.exports = router;
