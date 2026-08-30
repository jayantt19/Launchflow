const express = require("express");
const { createAdmin,getAdmin, updateUserRole,getAllTickets, assignTicket,getDashboardStats } = require("../controllers/adminController");
const authMiddleware=require('../middleware/authMiddleware');
const roleMiddleware=require('../middleware/roleMiddleware');

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
module.exports = router;