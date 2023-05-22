const express = require('express');
const router = express.Router();

const videosControllers = require('../controllers/videos-controllers');
const checkAuth = require('../middleware/check-auth');
const checkUpload = require('../middleware/check-upload');
const videoUpload = require('../middleware/video-upload');


/* GET video by ID. */
router.get('/:vid', videosControllers.getVideoById);
/* GET videos by user ID. */
router.get('/user/:uid', videosControllers.getVideosByUserId);
/* Middleware to check autentication */
router.use(checkAuth);
/* POST upload video */
router.post('/upload',videoUpload.single('video'), checkUpload, videosControllers.upload )

module.exports = router;