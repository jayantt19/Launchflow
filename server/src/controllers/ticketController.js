const Ticket=require('../models/Ticket');
const mongoose=require('mongoose')
const User = require("../models/User");
const Notification = require('../models/Notification');
 
const createTicket=async(req,res)=>{
    try{
  const {title,description,priority}=req.body;


  if(!title || !description){
    return res.status(400).json({
        message:"Title and Description are required"
    });
  }

  if (!["low", "medium", "high", "urgent"].includes(priority)) {
    return res.status(400).json({
        message: "Invalid priority"
    });
}
   let slaHours;
   if (priority === "urgent") {
    slaHours = 1;
}

 if (priority === "high") {
    slaHours = 4;
}

if (priority === "medium") {
    slaHours = 12;
}

if (priority === "low") {
    slaHours = 24;
}
const slaDeadline = new Date();
slaDeadline.setHours(
    slaDeadline.getHours() + slaHours
);
  const ticket=await Ticket.create({
    title,
    description,
    priority,
    slaDeadline,
    createdBy:req.user._id,
    activity: [
    {
        action: "Ticket created",
        performedBy: req.user._id
    }
]
  });
  const admins = await User.find({ role: "admin" });

for (const admin of admins) {
    await Notification.create({
        recipient: admin._id,
        message: `New ticket created: ${ticket.title}`,
        ticket: ticket._id
    });
}


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
        const{status}=req.query;
        const filter = {
    createdBy: req.user._id
};
if (status) {
    filter.status = status;
}
        const tickets=await Ticket.find(filter).populate("assignedTo", "name email role");
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

const getTicketbyID = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate("createdBy", "name email role")
            .populate("assignedTo", "name email role")
            .populate("comments.user", "name email role");

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        const isCreator =
            ticket.createdBy._id.toString() === req.user._id.toString();

        const isAssignedAgent =
            ticket.assignedTo &&
            ticket.assignedTo._id.toString() === req.user._id.toString();

        const isAdmin = req.user.role === "admin";

        if (!isCreator && !isAssignedAgent && !isAdmin) {
            return res.status(403).json({
                message: "You are not allowed to access this ticket"
            });
        }

        return res.status(200).json({
            message: "Ticket fetched successfully",
            ticket
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            err: err.message
        });
    }
};

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
           { returnDocument: "after" }
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
const addComment=async(req,res)=>{
try{
const ticket=await Ticket.findById(req.params.id);
if(!ticket){
    return res.status(403).json({
        message:"Ticket not found"
    })
}
  const {message}=req.body;
  if(!message){
    return res.status(400).json({
        message:"Message is Required"
    })
  }
  ticket.comments.push({
            user: req.user._id,
            message
        });

        ticket.activity.push({
    action: "Comment added",
    performedBy: req.user._id
});
        let recipient;

if (req.user.role === "customer") {
    recipient = ticket.assignedTo;
} else if (req.user.role === "agent") {
    recipient = ticket.createdBy;
}

        await ticket.save();
if (recipient) {
    await Notification.create({
        recipient,
        message: `${req.user.name || "Agent"} commented on your ticket: "${message}"`,
        ticket: ticket._id
    });
} 

        return res.status(201).json({
            message: "Comment added successfully",
            ticket
        });
}
catch(err){
    return res.status(500).json({
        message:"Server Error",
        err:err.message
    })
}
}

const closeTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        if (ticket.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to close this ticket"
            });
        }

        if (ticket.status !== "resolved") {
            return res.status(400).json({
                message: "Ticket must be resolved before closing"
            });
        }

        ticket.status = "closed";
        
   ticket.activity.push({
    action: "Ticket closed",
    performedBy: req.user._id
});

        await ticket.save();

        return res.status(200).json({
            message: "Ticket closed successfully",
            ticket
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server Error",
            err: err.message
        });
    }
};

module.exports={createTicket,getTicket,getTicketbyID,updateTicket,deleteTicket,addComment,closeTicket};