'use strict';

const router = require('express').Router(); // Create a Router instance

const token = require('./tokensController');

// Routes
router
  .route('/')
  .post(token.create)
  .get(token.list);

router
  .route('/:id')
  .get(token.retrieve)
  .patch(token.update)
  .delete(token.del);

module.exports = router;
