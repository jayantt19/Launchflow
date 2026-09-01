const express = require("express");
const router = express.Router();

const { askAIController } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/ask",
    authMiddleware,
    askAIController
);

module.exports = router;