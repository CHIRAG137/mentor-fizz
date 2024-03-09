const express=require('express');
const router=express.Router();
const {createMentor,assignStudents,updateMarks,removeStudentFromMentorsList}=require('../controllers/mentor');

router.post('/',createMentor);
router.post('/assign',assignStudents);
router.patch('/update',updateMarks);
router.patch('/remove',removeStudentFromMentorsList);

module.exports=router;