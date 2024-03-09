const nodemailer = require("nodemailer");

const sentMail = async (sender_email, receiver_email, mail_subject,html_message) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
    });
    
    const mailOptions={
        from: sender_email,
        to: receiver_email,
        subject: mail_subject,
        html: html_message
    };
    
    try {
        transporter.sendMail(mailOptions,(err,data)=>{
            if(err){
                res.status(500).json({error:err.message});
            }else{
                res.status(201).json({message:`A ${subject} mail Sent Successfully !!`});
            }
        });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};

module.exports={sentMail};
