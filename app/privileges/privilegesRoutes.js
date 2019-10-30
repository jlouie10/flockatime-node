'use strict';

const router = require('express').Router(); // Create a Router instance

const privilege = require('./privilegesController');

// Routes
router
  .route('/')
  .post(privilege.create)
  .get(privilege.list);

router
  .route('/:id')
  .get(privilege.retrieve)
  .patch(privilege.update)
  .delete(privilege.del);

module.exports = router;
