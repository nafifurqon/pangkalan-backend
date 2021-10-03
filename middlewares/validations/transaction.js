const { check, validationResult } = require('express-validator');
const response = require('../../reponses/api');

const rules = [
  check('do_number')
    .notEmpty()
    .withMessage('DO number cannot be empty')
    .trim(),
];

const validate = [
  rules,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.failed(res, 422, errors.errors[0].msg, null);
    }

    next();
  },
];

module.exports = { validate };
