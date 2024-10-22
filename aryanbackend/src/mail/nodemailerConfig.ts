const nodemailer =require('nodemailer');
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    host: "smtp.gmail.com",
    port:465,
    auth: {
        user: "vyasaryan786@gmail.com",
        pass: "srshixgdtbttkbza", 
    },
});

export const sendWelcomeEmail = async (to: string, firstName: string, password: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Welcome to Our Service!',
        text: `Hi ${firstName},\n\nWelcome to our platform! We are excited to have you on board.\n\n Login Password:${password} \n\nBest,\nThe Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; 
    }
};
