const express = require('express');
const router = express.Router();

const usersControllers = require('../controllers/users-controllers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', usersControllers.signup);

module.exports = router;
