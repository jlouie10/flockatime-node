'use strict';

const Role = require('./rolesModel');
const utils = require('../utils');

/**
 * Create a role
 */
function createRole(req, res) {
  Role.create(req.body)
    .then(function(role) {
      res.status(200).json(utils.formatRoleResponse(role));
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
 * List all roles sorted by id, with the most recent roles appearing first
 */
function listRoles(req, res) {
  Role.find(utils.formatQuery(req.query))
    .lean()
    .sort({ _id: -1 })
    .then(function(roles) {
      res.status(200).json(roles.map(role => utils.formatRoleResponse(role)));
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
 * Retrieve a role by id
 */
function retrieveRole(req, res, next) {
  Role.findOne({ _id: req.params.id })
    .lean()
    .then(function(role) {
      if (role === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such role: ${req.params.id}`
          }
        });
      } else {
        // Set role id and pass control to the next middleware function when
        // forwarding to a child route
        if (req.baseUrl.includes('privileges')) {
          res.locals.role = role._id;
          next();
        } else {
          res.status(200).json(utils.formatRoleResponse(role));
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
 * Update a role by id
 */
function updateRole(req, res) {
  Role.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then(function(role) {
      if (role === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such role: ${req.params.id}`
          }
        });
      } else {
        res.status(200).json(utils.formatRoleResponse(role));
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
 * Delete a role by id
 */
function deleteRole(req, res) {
  Role.deleteOne({ _id: req.params.id })
    .then(function(role) {
      if (role.deletedCount === 0) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such role: ${req.params.id}`
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
 * Attach a privilege to a role
 */
function attachToRole(req, res) {
  Role.findByIdAndUpdate(req.params.id, res.locals.attachment).catch(function(
    err
  ) {
    console.log(err);
  });
}

module.exports = {
  create: createRole,
  list: listRoles,
  retrieve: retrieveRole,
  update: updateRole,
  del: deleteRole, // Avoid 'delete' keyword in JS
  attach: attachToRole
};
