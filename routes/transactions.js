const express = require('express');

const router = express.Router();
const transaction = require('../controllers/transaction_controller');
// const validation = require('../middlewares/validations/user');

/* GET users listing. */
router.post('/', transaction.create);

module.exports = router;
