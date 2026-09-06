const express = require("express");
const { createAdmin,getAdmin, updateUserRole,getAllTickets, assignTicket,getDashboardStats,getAgentWorkload,getAllAgents,recommendAgent,updateTicketStatus } = require("../controllers/adminController");
const authMiddleware=require('../middleware/authMiddleware');
const roleMiddleware=require('../middleware/roleMiddleware');
const { checkSla } = require("../controllers/slaController");

const router = express.Router();

router.post("/create", createAdmin);
router.get("/users",getAdmin);
router.patch(
    "/users/:id/role",
    authMiddleware,
    roleMiddleware("admin"),
    updateUserRole
);
router.get("/tickets",authMiddleware,roleMiddleware("admin"),getAllTickets);
router.patch("/tickets/:id/assign",authMiddleware,roleMiddleware("admin"),assignTicket);
router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("admin"),
    getDashboardStats
);
router.get(
    "/agent-workload",
    authMiddleware,
    roleMiddleware("admin"),
    getAgentWorkload
);

router.patch("/tickets/:id/status",authMiddleware,roleMiddleware("admin"),updateTicketStatus);

router.get(
    "/agents",
    authMiddleware,
    roleMiddleware("admin"),
    getAllAgents
);
router.get(
    "/recommend-agent",
    authMiddleware,
    roleMiddleware("admin"),
    recommendAgent
);
router.get(
    "/check-sla",
    authMiddleware,
    roleMiddleware("admin"),
    checkSla
);

module.exports = router;