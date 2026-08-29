const express = require("express");
const { createAdmin,getAdmin, updateUserRole } = require("../controllers/adminController");
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
module.exports = router;