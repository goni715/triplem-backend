import config from "../config";
import nodemailer from "nodemailer";

const sendVerificationEmail = async (email: string, name: string, token: string) => {
  //transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports //587,
    auth: {
      user: config.smtp_username,
      pass: config.smtp_password,
    },
  });

   const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;

  const mailOptions = {
    from: `MTK Ecommerce ${config.smtp_from}`, //sender email address//smtp-username
    to: email, //receiver email address
    subject: "Verify Your Email",
   html: `<p>Hello ${name},</p>
           <p>Please verify your email by clicking <a href="${verifyUrl}">this link</a>.</p>`,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;