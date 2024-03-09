const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const app=express();
dotenv.config();
const connectDB=require('./db/connectDB');
const port=process.env.PORT || 3001;
const studentRouter=require('./routes/studentRoute');
const mentorRouter=require('./routes/mentorRoute');
connectDB();

// Middleware
app.use(express.json())
app.use(cors('*'))

// Routes
app.use('/api/students',studentRouter);
app.use('/api/mentors',mentorRouter);

// Listen
app.listen(port,()=>
    console.log(`Server running on port ${port}`)
)
