'use strict';

const hashPass = require('hashpass');

const User = require('./usersModel');
const utils = require('../utils');

/**
 * Create a user
 */
function createUser(req, res) {
  const password = hashPass(req.body.password);

  User.create({
    description: req.body.description,
    email: req.body.email,
    extensions: req.body.extensions,
    name: req.body.name,
    password: password.hash,
    role: req.body.role,
    salt: password.salt,
    status: req.body.status
  })
    .then(function(user) {
      res.status(200).json(utils.formatUserResponse(user));
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
 * List all users sorted by id, with the most recent users appearing first
 */
function listUsers(req, res) {
  User.find(utils.formatQuery(req.query), '-password -salt')
    .lean()
    .sort({ _id: -1 })
    .then(function(users) {
      res.status(200).json(users.map(user => utils.formatUserResponse(user)));
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
 * Retrieve a user by id
 */
function retrieveUser(req, res, next) {
  User.findOne({ _id: req.params.id }, '-password -salt')
    .lean()
    .then(function(user) {
      if (user === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such user: ${req.params.id}`
          }
        });
      } else {
        // Set user id and pass control to the next middleware function when
        // forwarding to a child route
        if (
          req.baseUrl.includes('flockalogs') ||
          req.baseUrl.includes('sessions') ||
          req.baseUrl.includes('tokens')
        ) {
          res.locals.user = user._id;
          next();
        } else {
          res.status(200).json(utils.formatUserResponse(user));
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

/**
 * Update a user by id
 */
function updateUser(req, res) {
  let reqBody = {};

  // Add password hash and salt to a request body that contains a password
  if (req.body.password) {
    Object.keys(req.body).forEach(key => {
      if (key === 'password') {
        const password = hashPass(req.body[key]);

        reqBody[key] = password.hash;
        reqBody.salt = password.salt;
      } else {
        reqBody[key] = req.body[key];
      }
    });
  } else {
    reqBody = req.body;
  }

  User.findOneAndUpdate({ _id: req.params.id }, reqBody, { new: true })
    .then(function(user) {
      if (user === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such user: ${req.params.id}`
          }
        });
      } else {
        res.status(200).json(utils.formatUserResponse(user));
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
 * Delete a user by id
 */
function deleteUser(req, res) {
  User.deleteOne({ _id: req.params.id })
    .then(function(user) {
      if (user.deletedCount === 0) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such user: ${req.params.id}`
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

/**
 * Attach an object to a user
 */
function attachToUser(req, res) {
  User.findByIdAndUpdate(req.params.id, res.locals.attachment).catch(function(
    err
  ) {
    console.log(err);
  });
}

module.exports = {
  create: createUser,
  list: listUsers,
  retrieve: retrieveUser,
  update: updateUser,
  del: deleteUser, // Avoid 'delete' keyword in JS
  attach: attachToUser
};
