'use strict';

const Flockalog = require('./flockalogsModel');
const utils = require('../utils');

/**
 * Create a FlockaLog
 */
function createFlockalog(req, res, next) {
  Flockalog.create({
    timestamps: req.body.timestamps,
    user: res.locals.user
  })
    .then(function(flockalog) {
      res.locals.attachment = {
        $addToSet: {
          flockalogs: flockalog._id
        }
      };

      res.status(200).json(utils.formatFlockalogResponse(flockalog));
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
 * List all FlockaLogs sorted by id, with the most recent FlockaLogs appearing first
 */
function listFlockalogs(req, res) {
  Flockalog.find({
    $and: [
      {
        user: res.locals.user
      },
      utils.formatQuery(req.query)
    ]
  })
    .lean()
    .sort({ _id: -1 })
    .then(function(flockalogs) {
      res
        .status(200)
        .json(
          flockalogs.map(flockalog => utils.formatFlockalogResponse(flockalog))
        );
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
 * Retrieve a FlockaLog by id
 */
function retrieveFlockalog(req, res) {
  Flockalog.findOne({
    _id: req.params.id,
    user: res.locals.user
  })
    .lean()
    .then(function(flockalog) {
      if (flockalog === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such FlockaLog: ${req.params.id}`
          }
        });
      } else {
        res.status(200).json(utils.formatFlockalogResponse(flockalog));
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
 * Update a FlockaLog by id
 */
function updateFlockalog(req, res, next) {
  Flockalog.findOneAndUpdate(
    {
      _id: req.params.id,
      user: res.locals.user
    },
    req.body,
    { new: true }
  )
    .then(function(flockalog) {
      if (flockalog === null) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such FlockaLog: ${req.params.id}`
          }
        });
      } else {
        res.locals.attachment = {
          $addToSet: {
            flockalogs: flockalog._id
          }
        };

        res.status(200).json(utils.formatFlockalogResponse(flockalog));
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
 * Delete a FlockaLog by id
 */
function deleteFlockalog(req, res, next) {
  Flockalog.deleteOne({
    _id: req.params.id,
    user: res.locals.user
  })
    .then(function(flockalog) {
      if (flockalog.deletedCount === 0) {
        res.status(404).json({
          error: {
            code: 404,
            message: `No such FlockaLog: ${req.params.id}`
          }
        });
      } else {
        res.locals.attachment = {
          $pull: {
            flockalogs: req.params.id
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
  create: createFlockalog,
  list: listFlockalogs,
  retrieve: retrieveFlockalog,
  update: updateFlockalog,
  del: deleteFlockalog // Avoid 'delete' keyword in JS
};
