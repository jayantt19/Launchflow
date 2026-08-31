const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Ticket=require('../models/Ticket')
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        res.status(201).json({
            message: "Admin created successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            err: err.message
        });
    }
};

const getAdmin=async(req,res)=>{
 try{
 const users=await User.find().select("-password");
  res.status(200).json({
            message:"Admin fetched successfully",
            users
        });

 }
 catch(err){
  return res.status(500).json({
    message:"Server Error",
    err:err.message
  })
 }
}

const updateUserRole=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
         const {role} = req.body;
              if (!["customer", "agent", "admin"].includes(role)) {
    return res.status(400).json({
        message: "Invalid role"
    });
}
         const updatedRole = await User.findByIdAndUpdate(
                     req.params.id,
                     {
                        role
                     },
                     { new: true }
                 );

                 return res.status(200).json({
    message: "User role updated successfully",
    user: updatedRole
});
    }
    catch(err){
        return res.status(500).json({
            message:"Server Error",
            err:err.message
        })
    }
}

const getAllTickets=async(req,res)=>{
  try{
    const { status, priority ,page,limit,search} = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip=(pageNumber - 1) * limitNumber;
    const filter={};
    if(status){
        filter.status=status;
    }
    if(priority){
        filter.priority=priority;
    }
    if (search) {
    filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
    ];
}
     const tickets = await Ticket.find(filter).skip(skip).limit(limitNumber);
     if (tickets.length === 0) {
    return res.status(404).json({
        message: "No tickets found"
    });
}

     res.status(200).json({
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

const assignTicket=async(req,res)=>{
    try{
      const ticket=await Ticket.findById(req.params.id);
      if(!ticket){
        return res.status(404).json({
            message:"Ticket does not exist"
        })
      }
   const {agentId}=req.body;

   const agent=await User.findById(agentId);
   if(!agent){
    return res.status(404).json({
        message:"Agent not found"
    })
   }
   if (agent.role !== "agent") {
    return res.status(400).json({
        message: "User is not an agent"
    });
}
   ticket.assignedTo = agentId;

await ticket.save();

return res.status(200).json({
    message: "Ticket assigned successfully",
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

const getDashboardStats=async(req,res)=>{
    try{
        const totalTickets=await Ticket.countDocuments();
        const openTickets=await Ticket.countDocuments({
            status:"open"
        });
        const continueTickets=await Ticket.countDocuments({
            status:"in-progress"
        });
        const resolvedTickets=await Ticket.countDocuments({
            status:"resolved"
        });
        const closedTickets=await Ticket.countDocuments({
            status:"closed"
        });

        const totalCustomers=await User.countDocuments({
            role:"customer"
        });
        const totalAgents=await User.countDocuments({
            role:"agent"
        });

        return res.status(200).json({
            message:"Dashboard stastics fetched successfully",
            stats:{
                totalTickets,
                openTickets,
                continueTickets,
                resolvedTickets,
                closedTickets,
                totalCustomers,
                totalAgents
            }
        })
    }
    catch(err){
        return res.status(500).json({
            message:"Server Error",
            err:err.message
        });
    }
}
module.exports = { createAdmin,getAdmin,updateUserRole,getAllTickets,assignTicket,getDashboardStats};