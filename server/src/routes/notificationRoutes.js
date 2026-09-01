const express = require("express");
const router = express.Router();

const { getNotifications, markAsRead,getUnreadCount } = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getNotifications);
router.patch("/:id/read",authMiddleware,markAsRead);
router.get("/unread-count", authMiddleware, getUnreadCount);
module.exports = router;