
const express = require("express");
const router = express.Router();
const prisma = require('../prisma/client');
const fs = require('fs');
const path = require('path');


const userController = require ('../controllers/userController');
const authMiddleware = require ('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.get("/me", authMiddleware, userController.getMe);
router.get('/users/by-role', authMiddleware, userController.getUsersByRole)
router.get('/users/free-teachers', authMiddleware, roleMiddleware(['observer']), userController.getFreeTeachers)
router.patch('/me/avatar', authMiddleware, upload.avatar.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { avatarUrl: true },
        });

        if (user?.avatarUrl) {
            const oldPath = path.join(process.cwd(), user.avatarUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: { avatarUrl },
            select: { id: true, avatarUrl: true },
        });

        return res.json(updated);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
});

module.exports  = router;