

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const prisma = require('../../prisma/client');

router.get('/roles', authMiddleware, async (req, res) => {
    try {
        const roles = await prisma.role.findMany({ orderBy: { id: 'asc' } });
        res.json(roles);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;