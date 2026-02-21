const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const streamController = require('../controllers/streamController');
const router = express.Router();



router.post('/stream', authMiddleware, roleMiddleware(['observer']), streamController.createStream);


module.exports = router;