const mongoose=require('mongoose');
const mentorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    students:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Student',
        }
    ],
},{
    timestamps:true
})

const Mentor=mongoose.model('Mentor',mentorSchema);
module.exports=Mentor;
