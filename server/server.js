require("dotenv").config();
const app=require('./src/app');
const connectDB=require('./src/configs/db')


connectDB();
const PORT=3000;

app.listen(3000,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})