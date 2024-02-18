'use strict';

const express = require('express');
const controllers = require('../controllers');

const router = express.Router();

router.route('/').all(controllers.index);
require('./orders.routes')(router);

exports.router = router;
