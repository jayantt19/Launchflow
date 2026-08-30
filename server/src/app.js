const cors=require('cors');
const cookieParser=require('cookie-parser');
const express=require('express');
const app=express();
const agentRoutes = require("./routes/agentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes=require('../src/routes/authRoutes');
const ticketRoutes=require('../src/routes/ticketRoutes');

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/tickets",ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent",agentRoutes);

module.exports=app;