const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const practiceController = require('../../controllers/student/practiceController');


router.use(authMiddleware, roleMiddleware(['student']));
router.get('/practice', practiceController.getPracticeInfo);

module.exports = router;