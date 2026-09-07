const cors=require('cors');
const cookieParser=require('cookie-parser');
const express=require('express');
const app=express();
const agentRoutes = require("./routes/agentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes=require('../src/routes/authRoutes');
const ticketRoutes=require('../src/routes/ticketRoutes');
const notificationRoutes=require('../src/routes/notificationRoutes')
const knowledgeRoutes = require("./routes/knowledgeRoutes");
const aiRoutes=require("../src/routes/aiRoutes")

app.use(cors({
    origin: "http://localhost:5173",
      "https://launchflow-rypn.onrender.com",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/tickets",ticketRoutes);
app.use("/admin", adminRoutes);
app.use("/agent",agentRoutes);
app.use("/knowledge", knowledgeRoutes);
app.use("/notifications",notificationRoutes);
app.use("/ai", aiRoutes);
app.get("/", (req, res) => {
    res.send("LaunchFlow Backend is running!");
});


module.exports=app;