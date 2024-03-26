const authController = require('../controllers/authController')
const validation = require('./validations/authValidation')
const { cleanReq }  = require('../shared/middleware/formatting')
const express = require('express');
const router = express.Router();

router.route('/register').post([cleanReq, validation.registerValidation], authController.register);
router.route('/login').post([cleanReq, validation.loginValidation], authController.login);

module.exports = router;