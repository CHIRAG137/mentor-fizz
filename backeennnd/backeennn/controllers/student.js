const Mentor = require('../models/mentor');
const Student = require('../models/student');
const sentMail=require('../utils/senMail');

const createStudent = async (req, res) => {
    const { name, subject, ideationMarks, evaluationMarks, vivaMarks, totalMarks } = req.body;
    if (!name || !subject) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const student = new Student({
        name,
        subject,
        ideationMarks,
        evaluationMarks,
        vivaMarks,
        totalMarks,
    });
    try {
        await student.save();
        res.status(201).json({ message: "Student created successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json(students);
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student
            .findById(id)
            .populate('mentorAssigned', 'name');
        res.status(200).json(student);
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const assignMentor = async (req, res) => {
    const { mentorId, studentId } = req.body;
    try {
        const mentor = await Mentor.findById(mentorId);
        const student = await Student.findById(studentId);
        if (!mentor || !student) {
            return res.status(400).json({ message: "Invalid mentor or student" });
        }
        mentor.studentsAssigned.push(studentId);
        student.isAssigned = true;
        student.mentorName = mentor.name;
        await mentor.save();
        await student.save();
        res.status(200).json({ message: "Mentor assigned successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAssignedStudents = async (req, res) => {
    try {
        const students = await Student.find({ isAssigned: true });
        res.status(200).json(students);
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getUnassignedStudents = async (req, res) => {
    try {
        const students = await Student.find({ isAssigned: false });
        res.status(200).json(students);
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getStudentsByMentor = async (req, res) => {
    const { id } = req.params;
    try {
        const students = await Student.find({ mentorAssigned: id });
        res.status(200).json(students);
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const addMultipleStudents = async (req, res) => {
    const students = req.body;
    try {
        await Student.insertMany(students);
        res.status(201).json({ message: "Students added successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateAllStudents = async (req, res) => {
    const { email } = req.body;
    try {
        const response=await Student.updateMany({}, { $set: { email } });
        res.status(200).json({ message: "Email added successfully",response});
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const emailTesting = async (req, res) => {
    try{
        const sender_email= process.env.EMAIL_USER;
        const receiver_email= "chiraggoel246@gmail.com";
        const mail_subject= "Testing Email";
        const html_message= "<h1>Testing Email</h1>";
        const resp=await sentMail(sender_email, receiver_email, mail_subject,html_message);
        res.status(200).json({ message: "Email sent successfully",resp });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {emailTesting, createStudent, getStudents, getStudentById, assignMentor, addMultipleStudents, getStudentsByMentor, getAssignedStudents, getUnassignedStudents, updateAllStudents };
