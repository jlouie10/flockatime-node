'use strict';

const router = require('express').Router(); // Create a Router instance

const session = require('./sessions/sessionsController');
const user = require('./users/usersController');

// Routes
router
  .route('/')
  .post(user.login, session.create, user.attach)
  .delete(session.logout, user.attach);

module.exports = router;
