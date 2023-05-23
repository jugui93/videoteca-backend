const express = require('express');
const router = express.Router();

const reviewsControllers = require('../controllers/reviews-controllers');
const checkReview = require('../middleware/check-review');
const checkAuth = require('../middleware/check-auth');

/* GET reviews by video ID. */
router.get('/:vid', reviewsControllers.getReviewsByVideoId);
/* Middleware to check autentication */
router.use(checkAuth);
/* POST create review */
router.post('/:vid', checkReview, reviewsControllers.createReview );


module.exports = router;