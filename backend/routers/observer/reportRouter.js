
const express = require("express");
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const reportController = require('../../controllers/observer/reportController');

router.get('/reports/groups', authMiddleware, roleMiddleware(['observer']), reportController.downloadGroupsReport);

module.exports = router;


