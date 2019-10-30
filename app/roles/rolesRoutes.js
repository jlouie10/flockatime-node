'use strict';

const router = require('express').Router(); // Create a Router instance

const role = require('./rolesController');

// Routes
router
  .route('/')
  .post(role.create)
  .get(role.list);

router
  .route('/:id')
  .get(role.retrieve)
  .patch(role.update)
  .delete(role.del);

module.exports = router;
