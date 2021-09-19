const express = require('express');

const router = express.Router();
const user = require('../controllers/user_controller');

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/register', user.register);
router.delete('/:id', user.destroy);

module.exports = router;
