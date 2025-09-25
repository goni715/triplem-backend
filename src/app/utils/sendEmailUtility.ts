import config from "../config";
import nodemailer from "nodemailer";

const sendEmailUtility = async (EmailTo: string, name: string, otp: string) => {
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

  const mailOptions = {
    from: `"MTK" <${config.smtp_from}>`,
    to: EmailTo,
    subject: "MTK Ecommerce Reset Password",
    text: `Hello ${name}, your OTP is ${otp}. This code is valid for 10 minutes.`,
    html: `...` // your existing HTML
  };


  return await transporter.sendMail(mailOptions);
};

export default sendEmailUtility;