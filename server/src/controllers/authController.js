const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');

const registerUser=async(req,res)=>{
    try{
       const {name,email,password}=req.body;
       if(!name ||!email || !password){
        return res.status(400).json({
            message:"All fields are required"
        });
       }

       const existingUser=await User.findOne({email})
       if(existingUser){
        return res.status(409).json({
            message:"User already exists"
        })
       };
    
       const hashedPassword=await bcrypt.hash(password,10);
       const user=await User.create({
        name,
        email,
        password:hashedPassword
       });

       const token=jwt.sign(
        {id:user._id,},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    );
    res.cookie("token",token,{
       httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        message:"User registered successfully",
        user:{
             id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
        }
    });
    }
    catch(err){
   res.status(500).json({
    message:"Server error",
    err:err.message
   });
    }
};

const loginUser=async(req,res)=>{
    try{
     const {email,password}=req.body;
     const user=await User.findOne({email});
     if(!user){
        return res.status(400).json({
            message:"Invalid Email or Password"
        });
     }

     const isPasswordCorrect=await bcrypt.compare(
        password, 
        user.password);
     if(!isPasswordCorrect){
        return res.status(400).json({
            message:"Invalid Email or Password"
        });
     }

     const token=jwt.sign({
        id:user._id,
        role:user.role
     },process.env.JWT_SECRET,
     {expiresIn:"7d"}
    );
res.cookie("token", token, {
   httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
});
    res.status(200).json({
        message:"Login Successful", 
        user:{
            id: user._id,
                name: user.name,
                email: user.email,
                 role: user.role
        },
    });
    }
    catch(err){
        res.status(500).json({
            message:"Server error",
            err:err.message
        });
    }
};

module.exports={registerUser,loginUser};