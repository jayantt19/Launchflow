const express=require('express');
const {registerUser,loginUser}=require('../controllers/authController');
const authMiddleware=require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",authMiddleware, (req,res)=>{
  res.json({
    message:"Profile fetched Successfully",
    user:req.user
  });
});
router.get("/admin/test",authMiddleware,adminMiddleware,(req,res)=>{
  res.json({
    message:"Welcome admin!!"
  });
});
module.exports=router;