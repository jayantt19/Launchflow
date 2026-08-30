const mongoose =require('mongoose');

const ticketSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    status:{
        type:String,
        enum:["open","in-progress","resolved","closed"],
        default:"open"
    },
    priority:{
        type:String,
        enum:["low","medium","high","urgent"],
        default:"medium"
    },
    comments: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }
]
},
{
    timestamps:true
}
);

const Ticket=mongoose.model("Ticket",ticketSchema);
module.exports=Ticket;