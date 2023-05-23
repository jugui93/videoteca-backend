const express = require('express');
const router = express.Router();

const commentsControllers = require('../controllers/comments-controllers');
const checkComment = require('../middleware/check-comment');
const checkAuth = require('../middleware/check-auth');

/* GET comments by video ID. */
router.get('/video/:vid', commentsControllers.getCommentsByVideoId);
/* Middleware to check autentication */
router.use(checkAuth);
/* POST create a comment */
router.post('/video/:vid', checkComment, commentsControllers.createComment );
/* PATCH update a comment by Id */
router.patch('/:cid',checkComment, commentsControllers.updateComment);
/* DELETE update video by Id */
router.delete('/:cid', commentsControllers.deleteComment);


module.exports = router;