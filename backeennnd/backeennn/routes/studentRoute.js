const express=require('express');
const router=express.Router();
const {emailTesting,getStudents,getStudentById,assignMentor,addMultipleStudents,getAssignedStudents,getUnassignedStudents,updateAllStudents}=require('../controllers/student');

// router.post('/create',createStudent);
// router.get('/:id',getStudentById);
// router.post('/assign',assignMentor);

router.post('/addMultiple',addMultipleStudents);

router.get('/',getStudents);
router.get('/assigned',getAssignedStudents);
router.get('/unassigned',getUnassignedStudents);
router.post('/updateall',updateAllStudents);

// router.post('/email',emailTesting);

module.exports=router;
