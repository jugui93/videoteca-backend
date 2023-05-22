const express = require('express');
const router = express.Router();

const usersControllers = require('../controllers/users-controllers');
const checkAuth = require('../middleware/check-auth')

/* POST user sign up. */
router.post('/signup', usersControllers.signup);
/* POST user log in. */
router.post('/login', usersControllers.login);
/* Middleware to check autentication */
router.use(checkAuth);
/* GET users listing. */
router.get('/', usersControllers.getUsers);
/* GET user by id. */
router.get('/:uid', usersControllers.getUserById);
/* PATCH user by id. */
router.patch('/:uid', usersControllers.updateUserById);
/* DELETE user by id. */
router.delete('/:uid', usersControllers.deleteUser)

module.exports = router;
