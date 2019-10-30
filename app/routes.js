'use strict';

const router = require('express').Router(); // Create a Router instance

// Require direct paths to avoid cirular dependencies
const users = require('./users/usersRoutes');

// Routes
router.use('/users', users);

module.exports = router;
