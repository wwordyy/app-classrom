

const express = require("express");
const router = express.Router();


const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const groupController = require('../controllers/groupController');


router.get('/groups', authMiddleware, roleMiddleware(['observer']), groupController.getGroups);


module.exports = router;