'use strict';

const router = require('express').Router(); // Create a Router instance

const user = require('./usersController');

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

module.exports = router;
