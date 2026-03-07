

const express = require("express");
const router = express.Router();
const prisma = require('../../prisma/client')

const teacherController = require ('../../controllers/teacher/teacherController');
const postController = require('../../controllers/teacher/postController');
const submissionController = require('../../controllers/teacher/submissionController');
const journalController = require('../../controllers/teacher/journalController');
const practiceResultController = require('../../controllers/teacher/practiceResultController');
const profileController = require('../../controllers/teacher/profileController');

const authMiddleware = require ('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const upload = require('../../middleware/uploadMiddleware');


router.use(authMiddleware, roleMiddleware(['teacher']));


router.get('/teacher/dashboard', teacherController.getTeacherDashboard);

router.get('/teacher/profile', profileController.getProfile);

router.post('/teacher/posts', upload.single('file'), postController.createPost);

router.get('/teacher/type-posts', postController.getTypePosts);


router.get('/teacher/posts/:postId/submissions', postController.getPostSubmissions);

router.patch('/teacher/posts/:postId', upload.none(), postController.updatePost);


router.patch('/teacher/submissions/:id/grade', submissionController.updateSubmission);


router.get('/teacher/journal', journalController.getGroupStudents);

router.get('/teacher/journal/:studentId', journalController.getStudentGrades);



router.get('/teacher/groups/:groupId/practice-results', practiceResultController.getResults);

router.post('/teacher/groups/:groupId/students/:studentId/practice-result', practiceResultController.upsertResult);


router.get('/teacher/my-students', async (req, res) => {
    try {

        const group = await prisma.group.findFirst({
            where: { teacherId: req.user.id },
            include: {
                students: {
                    select: { id: true, fullName: true, avatarUrl: true }
                }
            }
        });

        
        return res.json(group?.students ?? []);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
});

                    

module.exports  = router;