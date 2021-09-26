const express = require('express');

const router = express.Router();
const user = require('../controllers/user_controller');
const validation = require('../middlewares/validations/user');

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/register', validation.user, user.register);
router.post('/login', validation.user, user.login);
router.delete('/:id', user.destroy);

module.exports = router;
