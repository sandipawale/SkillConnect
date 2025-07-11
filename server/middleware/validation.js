import { body, validationResult } from 'express-validator';

// A middleware function to run the validation checks
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // Extract the error messages into a simple array
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    message: 'Validation failed, entered data is incorrect.',
    errors: extractedErrors,
  });
};

// Define the validation rules for the registration endpoint
const registerValidationRules = () => {
  return [
    // name must not be empty
    body('name')
      .trim()
      .not().isEmpty()
      .withMessage('Name is required.'),
    // email must be an email
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    // password must be at least 6 chars long
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
  ];
};


export {
  validate,
  registerValidationRules,
};  