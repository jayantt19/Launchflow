const express = require("express");
const router = express.Router();

const { createKnowledge } = require("../controllers/knowlegeController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/roleMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createKnowledge
);

module.exports = router;