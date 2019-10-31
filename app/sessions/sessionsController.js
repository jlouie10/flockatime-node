'use strict';

const hashPass = require('hashpass');
const uuidv1 = require('uuid/v1');

const Session = require('./sessionsModel');
const utils = require('../utils');

/**
 * Create a session
 */
function createSession(req, res) {
  const uuid = uuidv1();
  const sessionToken = hashPass(uuid);

  Session.create({
    description: req.body.description,
    salt: sessionToken.salt,
    sessionToken: sessionToken.hash,
    user: res.locals.user
  })
    .then(function(session) {
      // Expose the session token once in a response header, after creation
      res
        .status(200)
        .header('x-session-token', uuid)
        .json(session);
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
      res.status(200).json(sessions);
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
        res.status(200).json(session);
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
function updateSession(req, res) {
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
        res.status(200).json(session);
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
function deleteSession(req, res) {
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
        res.status(200).json({
          id: req.params.id,
          deleted: true
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
}

module.exports = {
  create: createSession,
  list: listSessions,
  retrieve: retrieveSession,
  update: updateSession,
  del: deleteSession // Avoid 'delete' keyword in JS
};
