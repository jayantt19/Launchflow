const express=require('express');

const {createTicket,getTicket,getTicketbyID, updateTicket,deleteTicket,addComment, closeTicket}=require('../controllers/ticketController');

const authMiddleware=require('../middleware/authMiddleware');

const router=express.Router();

router.post("/",authMiddleware,createTicket);

router.get("/", authMiddleware,getTicket);

router.get("/:id",authMiddleware,getTicketbyID);

router.patch("/:id",authMiddleware,updateTicket);

router.delete("/:id",authMiddleware,deleteTicket);

router.patch("/:id/close",authMiddleware,closeTicket);

router.post(
    "/:id/comments",
    authMiddleware,
    addComment
);

module.exports=router;