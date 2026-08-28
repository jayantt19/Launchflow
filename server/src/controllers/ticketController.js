const Ticket=require('../models/Ticket');

const createTicket=async(req,res)=>{
    try{
  const {title,description,priority}=req.body;

  if(!title || !description){
    return res.status(401).json({
        message:"Title and Description are required"
    });
  }

  const ticket=await Ticket.create({
    title,
    description,
    priority,
    createdBy:req.user._id
  });

  res.status(201).json({
    message:"Ticket created successfully",
    ticket
  });
    }
    catch(err){
        return res.status(500).json({
            message:"Server Error",
            err:err.message
        })
    }
};

const getTicket=async(req,res)=>{
    try{
        const tickets=await Ticket.find({
            createdBy:req.user._id
        });
        res.status(200).json({
            message:"Tickets fetched successfully",
            tickets
        });
    }
    catch(err){
        return res.status(500).json({
            message:"Server Error",
            err:err.message
        })
    }
}

const getTicketbyID=async(req,res)=>{
    try{
        const ticket=await Ticket.findById(req.params.id);
        if(!ticket){
            return res.status(401).json({
                message:"not found"
            });

        }
         if (ticket.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to access this ticket"
            });
        }

        res.status(200).json({
            message: "Ticket fetched successfully",
            ticket
        });
    }
    catch(err){
        return res.status(500).json({
            message:"Server error",
            err:err.message
        })
    }
}

const updateTicket=async(req,res)=>{
    try{
   const ticket=await Ticket.findById(req.params.id);
    if(!ticket){
            return res.status(401).json({
                message:" Ticket not found"
            });
    }
    if (ticket.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to update this ticket"
            });
        }

        const { status, priority } = req.body;

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            {
                status,
                priority
            },
            { new: true }
        );

        res.status(200).json({
            message: "Ticket updated successfully",
            ticket: updatedTicket
        });
}
    catch(err){
        return res.status(500).json({
            message:"Server Error",
            err:err.message
        })
    }
}

const deleteTicket=async(req,res)=>{
    try{
     const ticket=await Ticket.findById(req.params.id);
     if(!ticket){
        return res.status(404).json({
            message:"Ticket not found"
        })
     }

   if (ticket.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to delete this ticket"
            });
        }

        const deleteticket= await Ticket.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message:"Ticket deleted successfully"
        });
    }
    catch(err){
        return res.status(500).json({
            message:"Server Error",
            err:err.message
        })
    }
}

module.exports={createTicket,getTicket,getTicketbyID,updateTicket,deleteTicket};