const Mentor=require('../models/mentor');
const Student=require('../models/student');

// createMentor
const createMentor=async(req,res)=>{
    const {name}=req.body;
    try {
        const mentor=await Mentor.create({name});
        res.status(201).json({mentor});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};

// assign students to mentor mentor will choose students
// mentor can choose upto 4 students
const assignStudents=async(req,res)=>{
    const {mentorId,studentId}=req.body;
    try {
        const mentor=await Mentor.findById(mentorId);
        if(!mentor){
            return res.status(404).json({error:'Mentor not found'});
        }
        const studentsAssigned=mentor.students;
        if(studentsAssigned.length>4){
            return res.status(400).json({error:'Mentor can only choose upto 4 students'});
        }
        const student=await Student.findById({_id:studentId});
        if(!student){
            return res.status(404).json({error:'Student not found'});
        }
        // check if student is already assigned to a mentor
        // check in mentors students array if studentId is present
        if(student.isAssigned){
            return res.status(400).json({error:'Student is already assigned to a mentor'});
        }
        // now add this student to mentor's students array
        const updatedMentor=await Mentor.findByIdAndUpdate(mentorId,{$push:{students:studentId}},{new:true});
        // mark students mentorId as mentorId
        await Student.findByIdAndUpdate({_id:studentId},{mentor:mentorId,assigned:true});
        // mark students assigned as true
        res.status(201).json({mentor:updatedMentor});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};

const removeStudentFromMentorsList=async(req,res)=>{
    const {mentorId,studentId}=req.body;
    try {
        const mentor=await Mentor.findById(mentorId);
        if(!mentor){
            return res.status(404).json({error:'Mentor not found'});
        }
        const student=await Student.findById(studentId);
        if(!student){
            return res.status(404).json({error:'Student not found'});
        }
        const updatedMentor=await Mentor.findByIdAndUpdate(mentorId,{$pull:{students:studentId}},{new:true});
        await Student.findByIdAndUpdate({_id:studentId},{mentor:null,assigned:false});
        res.status(201).json({mentor:updatedMentor});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

// now this mentor can update the details of his students like =>{ideationMarks,evaluationMarks,vivaMarks}
// and totalMarks will be calculated as the sum of these three marks
// mentor can update the marks of his students

const updateMarks=async(req,res)=>{
    const {studentId,mentorId,ideationMarks,evaluationMarks,vivaMarks}=req.body;
    try{
        const mentor=await Mentor.findById(mentorId);
        if(!mentor){
            return res.status(404).json({error:'Mentor not found'});
        }
        const student=await Student.findById(studentId);
        if(!student){
            return res.status(404).json({error:'Student not found'});
        }
        // if(student.mentor){
        //     return res.status(400).json({error:'Student is not assigned to this mentor'});
        // }
        const updatedStudent=await Student.findByIdAndUpdate(studentId,{ideationMarks,evaluationMarks,vivaMarks},{new:true});
        res.status(201).json({student:updatedStudent});
    }
    catch (error) {
        res.status(500).json({error:error.message});
    }
}

module.exports={createMentor,assignStudents,updateMarks,removeStudentFromMentorsList};
