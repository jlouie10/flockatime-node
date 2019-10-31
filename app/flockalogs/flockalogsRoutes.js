'use strict';

const router = require('express').Router(); // Create a Router instance

const flockalog = require('./flockalogsController');

// Routes
router
  .route('/')
  .post(flockalog.create)
  .get(flockalog.list);

router
  .route('/:id')
  .get(flockalog.retrieve)
  .patch(flockalog.update)
  .delete(flockalog.del);

module.exports = router;
