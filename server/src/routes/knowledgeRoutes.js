const express = require("express");
const router = express.Router();

const { createKnowledge,getKnowledge,deleteKnowledge ,updateKnowledge} = require("../controllers/knowlegeController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createKnowledge
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getKnowledge
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteKnowledge
);
router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateKnowledge
);

module.exports = router;