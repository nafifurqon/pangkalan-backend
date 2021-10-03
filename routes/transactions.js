/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const transaction = require('../controllers/transaction_controller');
const transaction_validation = require('../middlewares/validations/transaction');

/* GET users listing. */
router.post('/', transaction_validation.validate, transaction.create);

module.exports = router;
