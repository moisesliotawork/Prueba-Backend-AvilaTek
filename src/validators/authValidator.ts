
const { body } = require('express-validator');

export const authValidator = {
  register: [
    body('username')
      .notEmpty().withMessage('Username is required')
      .isString().withMessage('Username must be a string'),
      
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Valid email is required'),
      
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  
  login: [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Valid email is required'),
      
    body('password')
      .notEmpty().withMessage('Password is required')
  ]
};