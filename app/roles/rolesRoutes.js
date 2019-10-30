'use strict';

const router = require('express').Router(); // Create a Router instance

const role = require('./rolesController');
const privileges = require('../privileges/privilegesRoutes');

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

// Forward to child routes
router.use('/:id/privileges', role.retrieve, privileges, role.attach);

module.exports = router;
