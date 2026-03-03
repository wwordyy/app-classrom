const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const postCommentController = require('../../controllers/shared/postCommentController');

router.use(authMiddleware);


router.get(
    '/posts/:postId/comments',
    roleMiddleware(['student', 'teacher']),
    postCommentController.getComments
);

router.post(
    '/posts/:postId/comments',
    roleMiddleware(['student']),
    postCommentController.createComment
);

router.post(
    '/posts/:postId/comments/:commentId/reply',
    roleMiddleware(['teacher']),
    postCommentController.replyComment
);

router.delete(
    '/comments/:commentId',
    roleMiddleware(['student', 'teacher']),
    postCommentController.deleteComment
);

module.exports = router;