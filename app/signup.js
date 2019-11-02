'use strict';

const router = require('express').Router(); // Create a Router instance

const user = require('./users/usersController');

// Routes
router.route('/').post(user.create);

module.exports = router;
