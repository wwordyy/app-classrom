const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const upload = require('../../middleware/uploadMiddleware');
const studentPostController = require('../../controllers/student/postController');



router.use(authMiddleware, roleMiddleware(['student']));

router.get('/posts', studentPostController.getPosts);

router.get('/posts/:postId', studentPostController.getPostById);

router.post('/posts/:postId/submit',
    upload.single('file'),
    studentPostController.submitPost
);

router.post('/posts/:postId/submit-final',
    upload.array('files', 3),
    studentPostController.submitFinalPost
);

module.exports = router;