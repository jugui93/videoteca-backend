const express = require('express');
const router = express.Router();

const commentsControllers = require('../controllers/comments-controllers');
const checkComment = require('../middleware/check-comment');
const checkAuth = require('../middleware/check-auth');

/* GET reviews by video ID. */
router.get('/:vid', commentsControllers.getCommentsByVideoId);
/* Middleware to check autentication */
router.use(checkAuth);
/* POST create review */
router.post('/:vid', checkComment, commentsControllers.createComment );


module.exports = router;