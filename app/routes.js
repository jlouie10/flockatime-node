'use strict';

const router = require('express').Router(); // Create a Router instance

const auth = require('./auth');
const login = require('./login');
const signup = require('./signup');

// Require direct paths to avoid cirular dependencies
const roles = require('./roles/rolesRoutes');
const users = require('./users/usersRoutes');

// Public routes that don't require authentication and authorization
router.use('/login', login);
router.use('/signup', signup);

// Router-level middleware
router.use(auth);

// Routes
router.use('/roles', roles);
router.use('/users', users);

module.exports = router;
