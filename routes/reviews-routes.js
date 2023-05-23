const express = require('express');
const router = express.Router();

const reviewsControllers = require('../controllers/reviews-controllers');

/* GET reviews by video ID. */
router.get('/:vid', reviewsControllers.getReviewsByVideoId);
/* GET videos by user ID. */
// router.get('/user/:uid', videosControllers.getVideosByUserId);
// /* GET videos by privacity. */
// router.get('/privacity/:status', videosControllers.getVideosByPrivacity);
// /* Middleware to check autentication */
// router.use(checkAuth);
// /* POST upload video */
// router.post('/upload',videoUpload.single('video'), checkUpload, videosControllers.uploadVideo );
// /* PATCH update video by Id */
// router.patch('/:vid',checkUpload, videosControllers.updateVideoById);
// /* DELETE update video by Id */
// router.delete('/:vid', videosControllers.deleteVideo);

module.exports = router;