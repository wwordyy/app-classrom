

const express = require("express");
const router = express.Router();


const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const chatController = require('../../controllers/shared/chatController');


router.post('/chats', authMiddleware, roleMiddleware(['observer', 'teacher']), chatController.createChat);
router.get('/chats', authMiddleware, chatController.getChats);
router.get('/chats/:chatId/messages', authMiddleware, chatController.getMessages);
router.post('/chats/:chatId/messages', authMiddleware, chatController.sendMessage);


module.exports = router;