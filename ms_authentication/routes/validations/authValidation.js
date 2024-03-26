const { body } = require('express-validator');
const { validate } = require('../../shared/middleware/base.validation');

// Username and password validation functions
const validateUsername = (username) =>
{
  // Check if username doesn't contain special characters
  const usernameRegex = /^[a-zA-Z0-9_. ]+$/;
  return usernameRegex.test(username);
};

const validateName = (name) =>
{
  // Check if name is provided and contains only letters and spaces
  const nameRegex = /^[a-zA-Z0-9_. !@-]+$/;
  return nameRegex.test(name);
};

const validatePassword = (password) => { return !password.includes(' ') };

exports.registerValidation = validate([
  body('user_name').notEmpty().withMessage('user name is required')
    .isString().withMessage('invalid user name format')
    .isLength({ min: 8 }).withMessage('password must be of length at least 8')
    .custom(validateUsername).withMessage("user name cannot contain special characters"),
  body('password').notEmpty().withMessage('password is required')
    .isString().withMessage('invalid password format')
    .isLength({ min: 6 }).withMessage('password must be of length at least 6')
    .custom(validatePassword).withMessage("password cannot contain spaces"),
  body('name').notEmpty().withMessage('name is required')
    .isString().withMessage('invalid  name format')
    .isLength({ min: 6 }).withMessage('name must be of length at least 6')
    .custom(validateName).withMessage("name can only contain leters and spaces"),
]);

exports.loginValidation = validate([
  body('user_name').notEmpty().withMessage('Stock name is required')
    .isString().withMessage('invalid user name format')
    .isLength({ min: 8 }).withMessage('password must be of length at least 8')
    .custom(validateUsername).withMessage("user name cannot contain special characters"),
  body('password').notEmpty().withMessage('Stock name is required')
    .isString().withMessage('invalid password format')
    .isLength({ min: 6 }).withMessage('password must be at least 6 characters')
    .custom(validatePassword).withMessage("password cannot contain spaces")
]);



