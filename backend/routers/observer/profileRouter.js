


const express = require("express");
const router = express.Router();


const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const profileController = require('../../controllers/observer/profileController');

router.get('/observer/profile', authMiddleware, roleMiddleware(['observer']), profileController.getProfile);


module.exports = router;