// nodemailerConfig.ts
const nodemailer =require('nodemailer');
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    host: "smtp.gmail.com",
    port:465,
    auth: {
        // user: process.env.EMAIL_USER,
        user: "khalidsaifullah0322@gmail.com",
        pass: "lrgeyfnaufbsofqc", 
        // pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (to: string, firstName: string, password: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        // from: "khalidsaifullah0322@gmail.com",
        to,
        subject: 'Welcome to Our Service!',
        text: `Hi ${firstName},\n\nWelcome to our platform! We are excited to have you on board.\n\n Login Password:${password} \n\nBest,\nThe Team`,
        // html: `<h1>Hi ${firstName},</h1><p>Welcome to our platform!</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; 
    }
};
