const mongoose=require('mongoose');

const studentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    subject:{
        type:String,
        required:true
    },
    ideationMarks:{
        type:Number,
    },
    evaluationMarks:{
        type:Number,
    },
    vivaMarks:{
        type:Number,
    },
    isAssigned:{
        type:Boolean,
        default:false,
    },
    mentor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Mentor'
    }
},{
    timestamps:true
})

const Student=mongoose.model('Student',studentSchema);
module.exports=Student;