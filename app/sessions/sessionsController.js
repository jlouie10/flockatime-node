'use strict';

const hashPass = require('hashpass');
const uuidv1 = require('uuid/v1');

const Session = require('./sessionsModel');
const utils = require('../utils');

/**
 * Create a session
 */
function createSession(req, res, next) {
  const uuid = uuidv1();
  const sessionToken = hashPass(uuid);

  Session.create({
    description: req.body.description,
    salt: sessionToken.salt,
    sessionToken: sessionToken.hash,
    user: res.locals.user
  })
    .then(function(session) {
      res.locals.attachment = {
        $addToSet: {
          sessions: session._id
        }
      };

      // Expose the session token once in a response header, after creation
      res
        .status(200)
        .header('x-session-token', uuid)
        .json(utils.formatSessionResponse(session));

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
 * List all sessions sorted by id, with the most recent sessions appearing first
 */
function listSessions(req, res) {
  Session.find(
    {
      $and: [
        {
          user: res.locals.user
        },
        utils.formatQuery(req.query)
      ]
    },
    '-salt -sessionToken'
  )
    .lean()
    .sort({ _id: -1 })
    .then(function(sessions) {
      res
        .status(200)
        .json(sessions.map(session => utils.formatSessionResponse(session)));
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
 * Retrieve a session by id
 */
function retrieveSession(req, res) {
  Session.findOne(
    {
      _id: req.params.id,
      user: res.locals.user
    },
    '-salt -sessionToken'
  )
    .lean()
    .then(function(session) {
      if (session === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such session: ${req.params.id}`
          }
        });
      } else {
        res.status(200).json(utils.formatSessionResponse(session));
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
 * Update a session by id
 */
function updateSession(req, res, next) {
  Session.findOneAndUpdate(
    {
      _id: req.params.id,
      user: res.locals.user
    },
    req.body,
    { new: true }
  )
    .then(function(session) {
      if (session === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such session: ${req.params.id}`
          }
        });
      } else {
        res.locals.attachment = {
          $addToSet: {
            sessions: session._id
          }
        };

        res.status(200).json(utils.formatSessionResponse(session));
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
 * Delete a session by id
 */
function deleteSession(req, res, next) {
  Session.deleteOne({
    _id: req.params.id,
    user: res.locals.user
  })
    .then(function(session) {
      if (session.deletedCount === 0) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such session: ${req.params.id}`
          }
        });
      } else {
        res.locals.attachment = {
          $pull: {
            sessions: req.params.id
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

/**
 * Return a promise that lists all sessions and uses the session token salt to
 * check for the hashed value
 */
function verifySession(sessionToken) {
  return new Promise(function(resolve, reject) {
    Session.find({})
      .lean()
      .sort({ _id: -1 })
      .then(function(results) {
        if (
          results.some(
            result =>
              hashPass(sessionToken, result.salt).hash === result.sessionToken
          )
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

module.exports = {
  create: createSession,
  list: listSessions,
  retrieve: retrieveSession,
  update: updateSession,
  del: deleteSession, // Avoid 'delete' keyword in JS
  verify: verifySession
};
