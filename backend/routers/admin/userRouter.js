const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/userController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require('../../middleware/roleMiddleware');

router.use(authMiddleware, roleMiddleware(['admin']));

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);
router.patch("/:id/toggle-active", userController.toggleActive);

module.exports = router;