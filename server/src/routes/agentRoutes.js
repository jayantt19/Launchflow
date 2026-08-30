const express = require("express");
const router = express.Router();

const { getAssignedTickets, updateTicketStatus } = require("../controllers/agentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/tickets",
    authMiddleware,
    roleMiddleware("agent"),
    getAssignedTickets
);
router.patch("/tickets/:id/status",authMiddleware,roleMiddleware("agent"),updateTicketStatus);

module.exports = router;