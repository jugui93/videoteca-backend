const express = require('express');
const router = express.Router();

const usersControllers = require('../controllers/users-controllers');
const checkAuth = require('../middleware/check-auth');
const checkSignup = require('../middleware/check-signup');
const checkUpdate = require('../middleware/check-user-update');

/* GET users listing. */
router.get('/', usersControllers.getUsers);
/* GET user by id. */
router.get('/:uid', usersControllers.getUserById);
/* POST user sign up. */
router.post('/signup',checkSignup, usersControllers.signup);
/* POST user log in. */
router.post('/login', usersControllers.login);
/* Middleware to check autentication */
router.use(checkAuth);
/* PATCH user by id. */
router.patch('/:uid',checkUpdate, usersControllers.updateUserById);
/* DELETE user by id. */
router.delete('/:uid', usersControllers.deleteUser)

module.exports = router;
