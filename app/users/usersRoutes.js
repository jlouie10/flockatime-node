'use strict';

const router = require('express').Router(); // Create a Router instance

const user = require('./usersController');
const sessions = require('../sessions/sessionsRoutes');
const tokens = require('../tokens/tokensRoutes');

// Routes
router
  .route('/')
  .post(user.create)
  .get(user.list);

router
  .route('/:id')
  .get(user.retrieve)
  .patch(user.update)
  .delete(user.del);

// Forward to child routes
router.use('/:id/sessions', user.retrieve, sessions, user.attach);
router.use('/:id/tokens', user.retrieve, tokens, user.attach);

module.exports = router;
