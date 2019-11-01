'use strict';

const router = require('express').Router(); // Create a Router instance

const auth = require('./auth');

// Require direct paths to avoid cirular dependencies
const roles = require('./roles/rolesRoutes');
const users = require('./users/usersRoutes');

// Router-level middleware
router.use(auth);

// Routes
router.use('/roles', roles);
router.use('/users', users);

module.exports = router;
