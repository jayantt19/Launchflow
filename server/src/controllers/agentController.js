const Ticket=require('../models/Ticket');


const getAssignedTickets=async(req,res)=>{
    try{
   const tickets=await Ticket.find({  assignedTo: req.user._id});
   if(tickets.length===0){
    return res.status(404).json({
        message:"Tickets not found"
    })
   }
   return res.status(200).json({
    message:"Tickets fetched successfully",
    tickets
   })
    }
    catch(err){
        return res.status(500).json({
            message:"Server Error",
            err:err.message
        })
    }
}
const updateTicketStatus=async(req,res)=>{
    try{
        const ticket=await Ticket.findById(req.params.id);
   if(!ticket){
    return res.status(404).json({
        message:"Ticket not found"
    })
   }
   if (!ticket.assignedTo) {
    return res.status(400).json({
        message: "Ticket is not assigned to any agent"
    });
}
   if(ticket.assignedTo.toString()!==req.user._id.toString()){
    return res.status(403).json({
        message:"You are not assigned to this ticket"
    })
   }
        const {status}=req.body;
        if (!["open", "in-progress", "resolved"].includes(status)) {
    return res.status(400).json({
        message: "Invalid status"
    });
}
   if (ticket.status === status) {
    return res.status(400).json({
        message: "Ticket is already in this status"
    });
}

const oldStatus = ticket.status;
        ticket.status = status;

ticket.activity.push({
    action: `Status changed from ${oldStatus} to ${status}`,
    performedBy: req.user._id
});

await ticket.save();

            return res.status(200).json({
                message:"Ticket Updated Successfully",
                ticket
            })
        }
    catch(err){
        return res.status(500).json({
            message:"Server Error",
            err:err.message
        })
    }
}
module.exports={getAssignedTickets,updateTicketStatus};