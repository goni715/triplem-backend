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

  console.log({
     user: config.smtp_username,
     pass: config.smtp_password,
     smtp_from: config.smtp_from
  })

  const mailOptions = {
    from: `"MTK" ${config.smtp_from}`, //sender email address//smtp-username
    to: EmailTo, //receiver email address
    subject: "MTK Ecommerce Reset Password",
     html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
      <!-- Header -->
      <div style="background-color: #1f2937; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">MTK Ecommerce</h1>
        <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 16px;">Password Reset Request</p>
      </div>
      <!-- Main Content -->
      <div style="background-color: #ffffff; padding: 40px 30px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
        <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Hello ${name}!</h2>
        <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Use the verification code below to proceed.</p>
    </div>
  `
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmailUtility;