'use strict';

const User = require('./usersModel');

/**
 * Create a user
 */
function createUser(req, res) {
  User.create({
    description: req.body.description,
    email: req.body.email,
    extensions: req.body.extensions,
    name: req.body.name,
    password: req.body.password,
    role: req.body.role,
    salt: 'salt',
    status: req.body.status
  })
    .then(function(user) {
      res.status(200).json(user);
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
  User.find(req.query, '-password -salt')
    .lean()
    .sort({ _id: -1 })
    .then(function(users) {
      res.status(200).json(users);
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
function retrieveUser(req, res) {
  User.findOne({ _id: req.params.id }, '-password -salt')
    .lean()
    .then(function(user) {
      res.status(200).json(user);
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
  User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then(function(user) {
      res.status(200).json(user);
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
      res.status(200).json(user);
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
  create: createUser,
  list: listUsers,
  retrieve: retrieveUser,
  update: updateUser,
  del: deleteUser // Avoid 'delete' keyword in JS
};
