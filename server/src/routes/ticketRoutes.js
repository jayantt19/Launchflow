const express=require('express');

const {createTicket,getTicket,getTicketbyID, updateTicket,deleteTicket}=require('../controllers/ticketController');

const authMiddleware=require('../middleware/authMiddleware');

const router=express.Router();

router.post("/",authMiddleware,createTicket);

router.get("/", authMiddleware,getTicket);

router.get("/:id",authMiddleware,getTicketbyID);

router.patch("/:id",authMiddleware,updateTicket);

router.delete("/:id",authMiddleware,deleteTicket);

module.exports=router;