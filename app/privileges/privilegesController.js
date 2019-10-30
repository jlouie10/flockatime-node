'use strict';

const Privilege = require('./privilegesModel');
const utils = require('../utils');

/**
 * Create a privilege
 */
function createPrivilege(req, res) {
  Privilege.create({
    actions: req.body.actions,
    name: req.body.name,
    resource: req.body.resource,
    role: res.locals.role,
    scope: req.body.scope
  })
    .then(function(privilege) {
      res.status(200).json(privilege);
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
 * List all privileges sorted by id, with the most recent privileges appearing first
 */
function listPrivileges(req, res) {
  Privilege.find({
    $and: [
      {
        role: res.locals.role
      },
      utils.formatQuery(req.query)
    ]
  })
    .lean()
    .sort({ _id: -1 })
    .then(function(privileges) {
      res.status(200).json(privileges);
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
 * Retrieve a privilege by id
 */
function retrievePrivilege(req, res) {
  Privilege.findOne({
    _id: req.params.id,
    role: res.locals.role
  })
    .lean()
    .then(function(privilege) {
      if (privilege === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such privilege: ${req.params.id}`
          }
        });
      } else {
        res.status(200).json(privilege);
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
 * Update a privilege by id
 */
function updatePrivilege(req, res) {
  Privilege.findOneAndUpdate(
    {
      _id: req.params.id,
      role: res.locals.role
    },
    req.body,
    { new: true }
  )
    .then(function(privilege) {
      if (privilege === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such privilege: ${req.params.id}`
          }
        });
      } else {
        res.status(200).json(privilege);
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
 * Delete a privilege by id
 */
function deletePrivilege(req, res) {
  Privilege.deleteOne({
    _id: req.params.id,
    role: res.locals.role
  })
    .then(function(privilege) {
      if (privilege.deletedCount === 0) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such privilege: ${req.params.id}`
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
  create: createPrivilege,
  list: listPrivileges,
  retrieve: retrievePrivilege,
  update: updatePrivilege,
  del: deletePrivilege // Avoid 'delete' keyword in JS
};
