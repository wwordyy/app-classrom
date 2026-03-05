
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const profileController = require('../../controllers/student/profileController');



router.use(authMiddleware, roleMiddleware(['student']));

router.get('/profile', profileController.getProfile);

router.post('/chat/teacher', async (req, res) => {

    try {
        const prisma = require('../../prisma/client');
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { studentGroup: { include: { teacher: true } } },
        });

        if (!user?.studentGroup?.teacher) {
            return res.status(404).json({ error: 'Преподаватель не найден' });
        }

        const teacherId  = user.studentGroup.teacher.id;
        const studentId  = req.user.id;

        const chatServiceInstance = require('../../services/shared/chatService');
        const chat = await chatServiceInstance.createChat(studentId, teacherId);

        return res.json(chat);


    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
});


module.exports = router;