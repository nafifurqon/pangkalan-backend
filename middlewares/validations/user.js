const { check, validationResult } = require('express-validator');
const PasswordValidator = require('password-validator');
const response = require('../../reponses/api');

const schema = new PasswordValidator();

const validationPassword = (password) => {
  const result = { status: true, message: '' };

  const isMin8 = schema.is().min(8).validate(password);
  if (!isMin8) {
    result.message = 'Password must be more than 8';
    result.status = false;
    return result;
  }

  const hasUppercase = schema.has().uppercase().validate(password);
  if (!hasUppercase) {
    result.message = 'Password must have uppercase';
    result.status = false;
    return result;
  }

  const hasLowercase = schema.has().lowercase().validate(password);
  if (!hasLowercase) {
    result.message = 'Password must have lowercase';
    result.status = false;
    return result;
  }

  const hasNotSpace = schema.has().not().spaces().validate(password);
  if (!hasNotSpace) {
    result.message = 'Password must not have spaces';
    result.status = false;
    return result;
  }

  const hasDigit = schema.has().digits().validate(password);
  if (!hasDigit) {
    result.message = 'Password must have number';
    result.status = false;
    return result;
  }

  const hasSymbol = schema.has().symbols().validate(password);
  if (!hasSymbol) {
    result.message = 'Password must have symbol';
    result.status = false;
    return result;
  }

  return result;
};

const rules = [
  check('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Email must be valid')
    .trim(),
];

const user = [
  rules,
  (req, res, next) => {
    const passwordValid = validationPassword(req.body.password);

    if (!passwordValid.status) {
      return response.failed(res, 422, passwordValid.message, null);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.failed(res, 422, errors.errors[0].msg, null);
    }

    next();
  },
];

module.exports = { user };
