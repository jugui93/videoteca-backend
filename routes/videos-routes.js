const express = require('express');
const router = express.Router();

const videosControllers = require('../controllers/videos-controllers');
const checkAuth = require('../middleware/check-auth');
const checkUpload = require('../middleware/check-upload');
const videoUpload = require('../middleware/video-upload');

/* GET videos ordered by rating. */
router.get('/by-rating', videosControllers.getVideosByRating);
/* GET video by ID. */
router.get('/:vid', videosControllers.getVideoById);
/* GET videos by user ID. */
router.get('/user/:uid', videosControllers.getVideosByUserId);
/* GET videos by privacity. */
router.get('/privacity/:status', videosControllers.getVideosByPrivacity);
/* Middleware to check autentication */
router.use(checkAuth);
/* POST upload video */
router.post('/upload',videoUpload.single('video'), checkUpload, videosControllers.uploadVideo );
/* PATCH update video by Id */
router.patch('/:vid',checkUpload, videosControllers.updateVideoById);
/* DELETE update video by Id */
router.delete('/:vid', videosControllers.deleteVideo);

module.exports = router;