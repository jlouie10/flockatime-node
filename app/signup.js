'use strict';

const router = require('express').Router(); // Create a Router instance

const user = require('./users/usersController');

// Routes
router.route('/').post(user.create);

// Handle invalid requests
router.use(invalidRequest);

/**
 * Error that is raised when a request is initiated with invalid parameters
 */
function invalidRequest(req, res) {
  res.status(404).json({
    error: {
      code: 404,
      message: `Unrecognized request URL (${req.method}: ${req.originalUrl})`
    }
  });
}

module.exports = router;
