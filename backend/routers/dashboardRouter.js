const express = require("express");
const router = express.Router();


const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const dashboardController = require('../controllers/dashboardController')

router.get("/dashboard/overview", authMiddleware, roleMiddleware(['observer']), 
                dashboardController.getOverview);

router.get("/dashboard/groups", authMiddleware, roleMiddleware(['observer']), 
                dashboardController.getGroupsSubmissionsSubmitted);

router.get("/dashboard/submissions", authMiddleware, roleMiddleware(['observer']), 
                dashboardController.getSubmissionStats);


module.exports = router;