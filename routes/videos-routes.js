const express = require('express');
const router = express.Router();

const videosControllers = require('../controllers/videos-controllers');
const checkAuth = require('../middleware/check-auth');
const checkUpload = require('../middleware/check-upload');
const videoUpload = require('../middleware/video-upload');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/* Middleware to check autentication */
router.use(checkAuth);
/* POST upload video */
router.post('/upload',videoUpload.single('video'), checkUpload, videosControllers.upload )

module.exports = router;