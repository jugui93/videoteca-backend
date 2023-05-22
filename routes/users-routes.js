const express = require('express');
const router = express.Router();

const usersControllers = require('../controllers/users-controllers')

/* GET users listing. */
router.get('/', usersControllers.getUsers);
/* POST user sign up. */
router.post('/signup', usersControllers.signup);
/* POST user log in. */
router.post('/login', usersControllers.login);


module.exports = router;
