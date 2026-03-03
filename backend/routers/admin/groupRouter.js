const express = require("express");
const router = express.Router();
const adminGroupController = require("../../controllers/admin/groupController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require('../../middleware/roleMiddleware');

router.use(authMiddleware, roleMiddleware(['admin']));

router.get("/", adminGroupController.getAll);
router.get("/:id", adminGroupController.getById);
router.post("/", adminGroupController.create);
router.put("/:id", adminGroupController.update);
router.delete("/:id", adminGroupController.remove);

module.exports = router;