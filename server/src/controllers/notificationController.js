const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Notifications fetched successfully",
            notifications
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server Error",
            err: err.message
        });
    }
};

const markAsRead = async (req, res) => {
    try {
      const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id
});

  if (!notification) {
    return res.status(404).json({
        message: "Notification not found"
    });
}
   notification.read = true;
await notification.save();

   return res.status(200).json({
    message:"Notification read successfully",
    notification
   })
    } catch (err) {
        return res.status(500).json({
            message: "Server Error",
            err: err.message
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
   const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    read: false
});

   return res.status(200).json({
    message: "Unread notification count fetched successfully",
    unreadCount
});
    } catch (err) {
        return res.status(500).json({
            message: "Server Error",
            err: err.message
        });
    }
};
module.exports = {
    getNotifications,markAsRead,getUnreadCount
};