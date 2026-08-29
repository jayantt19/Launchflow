const bcrypt = require("bcryptjs");
const User = require("../models/User");

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
module.exports = { createAdmin,getAdmin,updateUserRole};