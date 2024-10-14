import nodemailer, { Transporter } from 'nodemailer';
import { config } from 'dotenv';


config();


interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}


const transporter: Transporter = nodemailer.createTransport({
  host:"smtp.gmail.com",
  service: 'gmail', 
  secure:true,
  port:465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendRegistrationEmail = async (toEmail: string, userName: string, password: string): Promise<void> => {
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER!, 
    to: toEmail,
    subject: 'Welcome to Job Portal',
    html: `
      <html>
        <body>
          <h1>Welcome, ${userName}!</h1>
          <p>Thank you for registering with our family. We're excited to have you on board.</p>
          <p>Your account has been successfully created. Your password is: ${password}\n\nPlease change it as soon as possible.</p>
          <p>If you have any questions, feel free to reach out.</p>
          <p>Best regards,</p>
          <p>Vyas Himachali Family</p>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { sendRegistrationEmail };
