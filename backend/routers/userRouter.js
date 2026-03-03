
const express = require("express");
const router = express.Router();

const userController = require ('../controllers/userController');
const authMiddleware = require ('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');



router.get("/me", authMiddleware, userController.getMe);
router.get('/users/by-role', authMiddleware, userController.getUsersByRole)
router.get('/users/free-teachers', authMiddleware, roleMiddleware(['observer']), userController.getFreeTeachers)


module.exports  = router;