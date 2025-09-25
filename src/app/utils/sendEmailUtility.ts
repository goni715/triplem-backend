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
  from: `"MTK" ${config.smtp_from}`,
  to: EmailTo,
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
      
      <!-- Verification Code -->
      <div style="background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
        <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; display: inline-block;">
          <span style="color: #1f2937; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace;">${otp}</span>
        </div>
      </div>
      
      <!-- Instructions -->
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 0 6px 6px 0;">
        <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Important Instructions:</h3>
        <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.5;">
          <li>Enter this code on the password reset page</li>
          <li>This code will expire in 10 minutes</li>
          <li>Do not share this code with anyone</li>
        </ul>
      </div>
      

      
      <!-- Security Notice -->
      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 20px; margin: 30px 0;">
        <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">🔒 Security Notice</h3>
        <p style="color: #7f1d1d; margin: 0; font-size: 14px; line-height: 1.5;">If you didn't request this password reset, please ignore this email or contact our support team immediately. Your account security is important to us.</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
      <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">This email was sent by MTK Ecommerce</p>
      <p style="color: #9ca3af; margin: 0 0 20px 0; font-size: 12px;">If you have any questions, contact us at support@mtkecommerce.com</p>
      
      <!-- Social Links -->
      <div style="margin: 20px 0;">
        <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
        <span style="color: #d1d5db;">|</span>
        <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
        <span style="color: #d1d5db;">|</span>
        <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Contact Support</a>
      </div>
      
      <p style="color: #9ca3af; margin: 0; font-size: 11px;">© 2025 MTK Ecommerce. All rights reserved.</p>
    </div>
  </div>
  `
};

  return await transporter.sendMail(mailOptions);
};

export default sendEmailUtility;