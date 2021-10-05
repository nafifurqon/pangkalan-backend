/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const transaction = require('../controllers/transaction_controller');
const transaction_validation = require('../middlewares/validations/transaction');
const restrict = require('../middlewares/resctrict');

/* GET users listing. */
router.post('/', restrict.user, transaction_validation.validate, transaction.create);

module.exports = router;
