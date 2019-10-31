'use strict';

const router = require('express').Router(); // Create a Router instance

const session = require('./sessionsController');

// Routes
router
  .route('/')
  .post(session.create)
  .get(session.list);

router
  .route('/:id')
  .get(session.retrieve)
  .patch(session.update)
  .delete(session.del);

module.exports = router;
