

const express = require("express");
const router = express.Router();

const teacherController = require ('../../controllers/teacher/teacherController');
const postController = require('../../controllers/teacher/postController');
const submissionController = require('../../controllers/teacher/submissionController');
const journalController = require('../../controllers/teacher/journalController');
const practiceResultController = require('../../controllers/teacher/practiceResultController');

const authMiddleware = require ('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const upload = require('../../middleware/uploadMiddleware');


router.use(authMiddleware, roleMiddleware(['teacher']));


router.get('/teacher/dashboard', teacherController.getTeacherDashboard);

router.post('/teacher/posts', upload.single('file'), postController.createPost);

router.get('/teacher/type-posts', postController.getTypePosts);


router.get('/teacher/posts/:postId/submissions', postController.getPostSubmissions);

router.patch('/teacher/posts/:postId', upload.none(), postController.updatePost);


router.patch('/teacher/submissions/:id/grade', submissionController.updateSubmission);


router.get('/teacher/journal', journalController.getGroupStudents);

router.get('/teacher/journal/:studentId', journalController.getStudentGrades);



router.get('/teacher/groups/:groupId/practice-results', practiceResultController.getResults);

router.post('/teacher/groups/:groupId/students/:studentId/practice-result', practiceResultController.upsertResult);

                    

module.exports  = router;