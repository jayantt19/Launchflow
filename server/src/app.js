const cors=require('cors');
const cookieParser=require('cookie-parser');
const express=require('express');
const app=express();
const authRoutes=require('../src/routes/authRoutes');

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

module.exports=app;