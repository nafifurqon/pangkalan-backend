/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const transaction = require('../controllers/transaction_controller');
const transaction_validation = require('../middlewares/validations/transaction');
const restrict = require('../middlewares/resctrict');

router.post('/', restrict.user, transaction_validation.validate, transaction.create);
router.get('/:id', restrict.user, transaction.get);
router.put('/:id', restrict.user, transaction_validation.validate, transaction.update);
router.delete('/:id', restrict.user, transaction.remove);

module.exports = router;
