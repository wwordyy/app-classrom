

const express = require("express");
const router = express.Router();


const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const groupController = require('../../controllers/observer/groupController');


router.get('/groups', authMiddleware, roleMiddleware(['observer']), groupController.getGroups);
router.patch('/groups/:groupId/assign-teacher', authMiddleware, 
                    roleMiddleware(['observer']), groupController.assignTeacher)

router.delete('/groups/:groupId/remove-teacher', authMiddleware, 
                        roleMiddleware(['observer']), groupController.removeTeacher)


module.exports = router;